import gql from "graphql-tag";

const gameListGet = gql`
    query gameGet {
        gameGet(where: { category: 2 }) {
            id
            title
            user{
                id
                name
            }
            version
            enabled
            created_at
        }
    }
`;
const gameGetById =  gql`
    query gameGet($id: Int) {
        gameGet(where: { category: 2 , id: $id}) {
            id
            title
            description
            pathname
            user{
                id
                name
            }
            version
            hashtags
            activated
            enabled
            pathname
            url_game
            url_thumb
            url_thumb_gif
            created_at
        }
    }
`;

const gameListGetOptionAxios = ( order: string, limit: number, offset: number) => `
    query gameGet {
        gameGet(where: { category: 2 }, order: "${order}", limit: ${limit}, offset: ${offset}) {
            id
            title
            user{
                id
                name
            }
            version
            enabled
            created_at
        }

        gameCount(where: { category: 2 })
    }
`;

const gameDelete = gql`
    mutation gameDelete($id: Int!){
        gameDelete(id: $id)
    }
`;

const gameHide = gql`
    mutation gameEdit($id: Int) {
        gameEdit(game: {id: $id, enabled: false, activated: false}){
            id
        }
    }
`;
const gameShow = gql`
    mutation gameEdit($id: Int) {
        gameEdit(game: {id: $id, enabled: true, activated: true}){
            id
        }
    }
`;

const gameMoveOfficial = gql`
    mutation gameEdit($id: Int) {
        gameEdit(game: {id: $id, official: true}){
            id
        }
    }
`;

export default {gameListGet, gameGetById, gameListGetOptionAxios, gameDelete, gameHide, gameShow, gameMoveOfficial};