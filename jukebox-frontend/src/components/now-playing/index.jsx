import PropTypes from "prop-types";
import "./index.css";
import {useState} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

function ContinuousSlider() {
  const [value, setValue] = useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Stack spacing={2} direction="row" sx={{ mb: 1}} alignItems="center">
        <VolumeDown />
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
    </Box>
  );
}

  
function NowPlaying({ song }) {
    return (
        <div className="CurrentlyPlaying">
            <img src={song.cover} alt="Album cover" />
            <div className="info">
            <>
            <div className="text">
                <span className="title">{song.title}</span>
                <span className="artist">{song.artist}</span>
                {/* <p>{song.duration}</p> */}
            </div>
            </>
            <ContinuousSlider />
            </div>
        </div>
    );
}

NowPlaying.propTypes = {
    song: PropTypes.shape({
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        cover: PropTypes.string.isRequired,
    }).isRequired,
};

export default NowPlaying;
