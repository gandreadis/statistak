import {Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res} from '@nestjs/common';
import {PieceDto} from "../../dtos/piece.dto";
import {ValidateObjectId} from "../../pipes/validate-object-id.pipes";
import {PiecesService} from "./pieces.service";

@Controller('api/tours/:tourId/pieces')
export class PiecesController {
  constructor(private piecesService: PiecesService) {}

  @Post()
  async createPiece(
    @Param("tourId", new ValidateObjectId()) tourId,
    @Body() createPieceDTO: PieceDto,
    @Res() res,
  ) {
    const newPiece = await this.piecesService.createPiece(createPieceDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Piece added successfully!',
      newPiece,
    });
  }

  @Get(':pieceId')
  async getPiece(
    @Param("tourId", new ValidateObjectId()) tourId,
    @Param('pieceId', new ValidateObjectId()) pieceId,
    @Res() res,
  ) {
    const piece = await this.piecesService.getPiece(pieceId);
    if (!piece) {
      throw new NotFoundException('Piece does not exist!');
    }
    return res.status(HttpStatus.OK).json(piece);
  }

  @Get()
  async getPieces(
    @Param("tourId", new ValidateObjectId()) tourId,
    @Res() res,
  ) {
    const pieces = await this.piecesService.getPieces(tourId);
    return res.status(HttpStatus.OK).json(pieces);
  }

  @Put(':pieceId')
  async editPiece(
    @Param("tourId", new ValidateObjectId()) tourId,
    @Param('pieceId', new ValidateObjectId()) pieceId,
    @Body() createPieceDTO: PieceDto,
    @Res() res,
  ) {
    const editedPiece = await this.piecesService.editPiece(pieceId, createPieceDTO);
    if (!editedPiece) {
      throw new NotFoundException('Piece does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Piece edited successfully!',
      editedPiece,
    });
  }

  @Delete(':pieceId')
  async deletePiece(
    @Param("tourId", new ValidateObjectId()) tourId,
    @Param('pieceId', new ValidateObjectId()) pieceId,
    @Res() res,
  ) {
    const deletedPiece = await this.piecesService.deletePiece(pieceId);
    if (!deletedPiece) {
      throw new NotFoundException('Piece does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Piece deleted successfully!',
      deletedPiece,
    });
  }
}
