import * as React from 'react';
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import { PieceDto } from '../../../../server/src/api/dtos/piece.dto';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

type EditableVideoListProps = {
  videos: { url: string; pieces: PieceDto[] }[];
  setVideos: (videos: { url: string; pieces: PieceDto[] }[]) => void;
  allPieces: PieceDto[];
};

const EditableVideoList = ({ videos, setVideos, allPieces }: EditableVideoListProps) => {
  const videosWithPieceIds = videos.map(video => ({
    url: video.url,
    pieces: video.pieces.map(piece => {
      const id = piece as PieceDto | string;
      return typeof id === 'string' ? piece : piece._id;
    }),
  }));

  const addVideo = () => {
    setVideos([...videos, { url: '', pieces: [] }]);
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  };

  const deleteVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const updateVideo = (index: number, newVideo: { url: string; pieces: PieceDto[] }) => {
    setVideos(
      videos.map((video, idx) => {
        if (idx === index) {
          return newVideo;
        } else {
          return video;
        }
      }),
    );
  };

  return (
    <>
      <Button variant="contained" fullWidth color="primary" endIcon={<AddIcon />} onClick={addVideo}>
        Add Video
      </Button>
      {videosWithPieceIds.map((video, index) => (
        <Paper key={index}>
          <Box p={2} mb={2}>
            <TextField
              id={`video-field-${index}`}
              name={`video${index}`}
              label="YouTube link"
              onChange={event =>
                updateVideo(index, {
                  url: event.target.value,
                  pieces: (video.pieces as unknown) as PieceDto[],
                })
              }
              value={video.url}
              variant="outlined"
              fullWidth
            />
            <FormControl fullWidth variant="outlined" style={{ maxWidth: 250, marginTop: 10 }}>
              <InputLabel id={`pieces-select-label-${index}`}>Pieces in Video</InputLabel>
              <Select
                labelId={`pieces-select-label-${index}`}
                id={`pieces-select-${index}`}
                multiple
                value={video.pieces}
                onChange={event =>
                  updateVideo(index, {
                    url: video.url,
                    pieces: event.target.value as PieceDto[],
                  })
                }
                label="Pieces in Video"
                input={<Input />}
                variant="outlined"
              >
                {allPieces.map(piece => (
                  <MenuItem key={piece._id} value={piece._id}>
                    {piece.title + (piece.code ? ` (${piece.code})` : '')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box pt={1}>
              <Button
                color="secondary"
                variant="contained"
                endIcon={<DeleteIcon />}
                fullWidth
                onClick={() => deleteVideo(index)}
              >
                Delete video
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </>
  );
};

export default EditableVideoList;
