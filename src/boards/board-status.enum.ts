// db에 엔티티 만들었으므로 필요 없음
// export interface Board {
//     id: string;
//     title: string;
//     description: string;
//     status: BoardStatus
// }

export enum BoardStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}