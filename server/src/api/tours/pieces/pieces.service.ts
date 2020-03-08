import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Piece } from '../../interfaces/piece.interface';
import { PieceDto } from '../../dtos/piece.dto';

@Injectable()
export class PiecesService {
  constructor(@InjectModel('Piece') private readonly pieceModel: Model<Piece>) {}

  async createPiece(createPieceDTO: PieceDto): Promise<Piece> {
    const newPiece = await new this.pieceModel(createPieceDTO);
    return newPiece.save();
  }

  async getPiece(pieceId: string): Promise<Piece> {
    return await this.pieceModel.findById(pieceId).exec();
  }

  async getPieces(tourId: string): Promise<Piece[]> {
    return await this.pieceModel.find({ tour: tourId }).exec();
  }

  async editPiece(pieceId, createPieceDTO: PieceDto): Promise<Piece> {
    return await this.pieceModel.findByIdAndUpdate(pieceId, createPieceDTO, { new: true });
  }

  async deletePiece(pieceId): Promise<Piece> {
    return await this.pieceModel.findByIdAndRemove(pieceId);
  }
}
