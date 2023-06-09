import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import {v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';


@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    async getAllBoards(): Promise <Board[]> {
        return this.boardRepository.find();
    }
    // getAllBoards(): Board[] {
    //     return this.boards;
    // }
    createBoard(CreateBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardRepository.createBoard(CreateBoardDto);
        // throw new Error('Method not implemented.');
    }

    // async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    //     const {title, description} = createBoardDto;
    //     const board = this.boardRepository.create({
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     })

    //     await this.boardRepository.save(board);
    //     return board;
    // }

    async getBoardById(id: number): Promise <Board> {
        const found = await this.boardRepository.findOneBy({id});

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }
    // private boards: Board[] = []; // 다른 컴포넌트에서 보드 값을 수정하지 못하게 하기 위함 : db에 저장하기 때문에 지움


    // // description: description, 동일
    // createBoard(createBoardDto: CreateBoardDto) {
    //     const {title, description} = createBoardDto;

    //     const board : Board = {
    //         id: uuid(), // 유니크한 아이디를 위해 uuid 사용
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);
    //     return board;
    // }

    // getBoardById(id: string): Board {
    //     const found = this.boards.find((board) => board.id == id);

    //     if(!found) {
    //         throw new NotFoundException(`Can't find Board with id ${id}`);
    //     }
    //     return found;
    // }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);

        if(result.affected == 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        console.log('result', result);
    }
    // deleteBoard(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }
}
