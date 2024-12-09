import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Piece } from '../../interfaces/piece.interface';
import { Performance } from '../../interfaces/performance.interface';
import { PieceDto } from '../../dtos/piece.dto';

@Injectable()
export class PiecesService {
  constructor(
    @InjectModel('Piece') private readonly pieceModel: Model<Piece>,
    @InjectModel('Performance') private readonly performanceModel: Model<Performance>,
  ) {}

  async createPiece(createPieceDTO: PieceDto): Promise<Piece> {
    const newPiece = await new this.pieceModel(createPieceDTO);
    return newPiece.save();
  }

  async getPiece(pieceId: string): Promise<Piece> {
    const performancesWithVideosOfPiece = await this.performanceModel
      .find({
        'videos.pieces': pieceId,
      })
      .exec();
    const videos = [];
    performancesWithVideosOfPiece.forEach(performance =>
      performance.videos.forEach(video => {
        // @ts-ignore
        if (video.pieces.indexOf(pieceId) !== -1) {
          videos.push({
            url: video.url,
            performance: performance,
          });
        }
      }),
    );

    const piece = await this.pieceModel.findById(pieceId).exec();
    return { ...piece['_doc'], videos };
  }

  async getPieces(tourId: string): Promise<Piece[]> {
    return await this.pieceModel.find({ tour: tourId }).exec();
  }

  async editPiece(pieceId, createPieceDTO: PieceDto): Promise<Piece> {
    return await this.pieceModel.findByIdAndUpdate(pieceId, createPieceDTO, { new: true }).exec();
  }

  async deletePiece(pieceId): Promise<Piece> {
    return await this.pieceModel.findByIdAndDelete(pieceId).exec();
  }
}
