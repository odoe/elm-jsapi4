port module Cards exposing (..)

import Html exposing (Html, program, div, span, img, text, figure, p, i)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)


type alias Model =
    { items : List Card
    }


type alias Card =
    { id : String
    , title : String
    , thumbnailUrl : Maybe String
    , itemUrl : String
    , snippet : Maybe String
    , selected : Bool
    }


sampleCard : Card
sampleCard =
    { id = "dummy"
    , title = "Test"
    , thumbnailUrl = Just "Test"
    , itemUrl = "Test"
    , snippet = Just "Test"
    , selected = False
    }


initialModel : Model
initialModel =
    { items =
        []
    }


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- MESSAGES


type Msg
    = Select String
    | Change Model



-- VIEW


viewCard : Card -> Html Msg
viewCard card =
    let
        cardStyle =
            if card.selected == True then
                "card card-bar-blue block trailer-1"
            else
                "card block trailer-1"

        showVal value =
            case value of
                Nothing ->
                    ""

                Just val ->
                    val
    in
        div [ class cardStyle ]
            [ figure [ class "card-image-wrap" ]
                [ img
                    [ class "card-image"
                    , card.thumbnailUrl
                        |> showVal
                        |> src
                    ]
                    []
                , div [ class "card-image-caption" ]
                    [ text card.title
                    ]
                ]
            , div [ class "card-content" ]
                [ card.snippet
                    |> showVal
                    |> text
                , div
                    [ class "btn btn-fill leader-1"
                    , onClick (Select card.id)
                    ]
                    [ text "View" ]
                ]
            ]


view : Model -> Html Msg
view model =
    let
        cardList =
            List.map viewCard model.items
    in
        div [ class "block-group block-group-4-up tablet-block-group-2-up phone-block-group-1-up" ]
            cardList



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Change newItems ->
            ( newItems, Cmd.none )

        Select itemid ->
            let
                selected t =
                    if t.id == itemid then
                        { t | selected = True }
                    else
                        { t | selected = False }

                findCard itemid =
                    let
                        valid val =
                            case val of
                                Nothing ->
                                    sampleCard

                                Just val ->
                                    val

                        card =
                            model.items
                                |> List.filter (\x -> x.id == itemid)
                                |> List.head
                    in
                        valid card
            in
                ( { model
                    | items = List.map selected model.items
                  }
                , selectCard (findCard itemid)
                )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    cards Change



-- PORTS


port selectCard : Card -> Cmd msg


port cards : (Model -> msg) -> Sub msg


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
