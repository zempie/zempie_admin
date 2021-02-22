import gql from "graphql-tag";

const gameListGet = gql`
    query gameGet {
        gameGet(where: {category: 1}) {
            id
            title
            user{
                id
                name
            }
            version
            enabled
            count_over
            count_heart
            created_at
        }
    }
`;

const gameListGetOption = gql`
    query gameGet($order: String, $limit: Int, $offset: Int) {
        gameGet(where: {category: 1}, order: $order, limit: $limit, offset: $offset) {
            id
            title
            user{
                id
                name
            }
            version
            enabled
            count_over
            count_heart
            created_at
        }

        gameCount
    }
`;

const gameListGetOptionAxios = ( order: string, limit: number, offset: number) => `
    query gameGet {
        gameGet(where: {category: 1}, order: "${order}", limit: ${limit}, offset: ${offset}) {
            id
            title
            user{
                id
                name
            }
            version
            enabled
            url_thumb
            count_over
            count_heart
            created_at
        }

        gameCount(where: {category: 1})
    }
`;


const gameGetById =  gql`
query gameGet($id: Int) {
    gameGet(where: {category: 1, id: $id}) {
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
        count_over
        count_heart
        emotions {
            e1
            e2
            e3
            e4
            e5
        }
        created_at
    }
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

const gameMoveChallenge = gql`
    mutation gameEdit($id: Int) {
        gameEdit(game: {id: $id, category: 0}){
            id
        }
    }
`;

export default {gameListGet, gameListGetOption, gameListGetOptionAxios, gameGetById, gameDelete, gameHide, gameShow, gameMoveChallenge};