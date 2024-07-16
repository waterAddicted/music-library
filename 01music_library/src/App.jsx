import React, { useState, useEffect } from 'react';
import './App.css';
import data from '../data.json'; 
import durationImage from '/images/duration.png'; 
import heart1Image from '/images/heart1.png';
import heart2Image from '/images/heart2.png';
import heart3Image from '/images/heart3.png';

const imagesData = [
  { src: '/images/portishead.png', alt: 'Portishead', name: 'Portishead' },
  { src: '/images/radiohead.png', alt: 'Radiohead', name: 'Radiohead' },
  { src: '/images/rammstein.png', alt: 'Rammstein', name: 'Rammstein' },
  { src: '/images/taylor_swift.png', alt: 'Taylor Swift', name: 'Taylor Swift' }
];

const App = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [artistNameForAlbum, setArtistNameForAlbum] = useState(''); 
  const [likes, setLikes] = useState({}); 
  const [isSongSearch, setIsSongSearch] = useState(false); 
  const [suggestions, setSuggestions] = useState([]); 

  useEffect(() => {
    setImages(imagesData);
    setFilteredImages(imagesData);
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = images.filter(image => image.name.toLowerCase().includes(searchTerm));
    setFilteredImages(filtered);
  };

  const handleImageClick = (image) => {
    setTransitioning(true);
    setTimeout(() => {
      setSelectedImage(image);
      setSelectedArtist(image.name); 
      setTransitioning(false);
    }, 600); 
  };

  const handleBackClick = () => {
    setSelectedImage(null);
    setSelectedArtist(null);
    setSearchTerm('');
    setFilteredImages(images);
    setSelectedAlbum(null); 
    setArtistNameForAlbum(''); 
    setIsSongSearch(false); 
  };

  const handleSongSearchClick = () => {
    setIsSongSearch(true); 
  };

  const handleSongSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = getAllSongs().filter(song =>
      song.title.toLowerCase().includes(searchTerm)
    );
    setSuggestions(filtered);
  };

  const handleLikeClick = (songTitle) => {
    setLikes((prevLikes) => {
      const newLikes = { ...prevLikes };
      newLikes[songTitle] = !newLikes[songTitle];  
      console.log('Saving likes to JSON:', newLikes);
      return newLikes;
    });
  };

  const AlbumsContainer = ({ artistName }) => {
    const artistData = data.find(artist => artist.name === artistName);

    if (!artistData) return null;

    const albums = artistData.albums;

    return (
      <div className="albums-container">
        <div className="albums-title">Albums:</div>
        {albums.map((album, index) => (
          <div key={index} className="album-container" onClick={() => handleAlbumClick(album, artistName)}>
            <img src={`/images/${artistName.toLowerCase().replace(' ', '_')}${index + 1}.png`} alt={album.title} className="album-image" />
            <p className="album-name">{album.title}</p>
          </div>
        ))}
      </div>
    );
  };

  const handleAlbumClick = (album, artistName) => {
    setSelectedAlbum(album); 
    setArtistNameForAlbum(artistName); 
  };

  const AlbumDetails = ({ album }) => {
    if (!album) return null;

    const { description, songs } = album;

    return (
      <div className="album-details">
        <h2>Album Details:</h2>
        <p><strong>Artist:</strong> {artistNameForAlbum}</p>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Album</th>
              <th>
                <img src={durationImage} alt="Duration" className="duration-header" />
              </th>
              <th>Like</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr key={index}>
                <td>{song.title}</td>
                <td>{album.title}</td>
                <td>{song.length}</td>
                <td>
                  <img
                    src={likes[song.title] ? heart3Image : heart1Image}
                    alt="Like"
                    className="duration-header"
                    onMouseOver={(e) => e.currentTarget.src = heart2Image}
                    onMouseOut={(e) => e.currentTarget.src = likes[song.title] ? heart3Image : heart1Image}
                    onClick={() => handleLikeClick(song.title)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Album Description:</strong> {description}</p>
      </div>
    );
  };

  const getAllSongs = () => {
    const allSongs = [];
    data.forEach(artist => {
      artist.albums.forEach(album => {
        album.songs.forEach(song => {
          allSongs.push({ ...song, artist: artist.name, album: album.title });
        });
      });
    });
    return allSongs;
  };

  return (
    <div className="container">
      {!isSongSearch && (
        <>
          {selectedImage && (
            <button className="back-button" onClick={handleBackClick}>Back</button>
          )}
          {!selectedImage && (
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          )}
          <div className={selectedImage ? 'selected-image-container' : 'images-container'}>
            {selectedImage ? (
              <div className={`selected-image-wrapper ${transitioning ? 'transitioning' : ''}`}>
                <img src={selectedImage.src} alt={selectedImage.alt} className="selected-image" />
                <p className="artist-name selected-artist-name">{selectedImage.name}</p>
                <AlbumsContainer artistName={selectedArtist} />
              </div>
            ) : (
              filteredImages.map((image, index) => (
                <div key={index} className="image-container" onClick={() => handleImageClick(image)}>
                  <div className="image-wrapper">
                    <img src={image.src} alt={image.alt} className="image" />
                  </div>
                  <p className="artist-name">{image.name}</p>
                </div>
              ))
            )}
          </div>
          {!selectedImage && (
            <div className="song-search-button-container">
              <button className="song-search-button" onClick={handleSongSearchClick}>
                Search Songs
              </button>
            </div>
          )}
          {selectedAlbum && (
            <div className="album-details-container">
              <AlbumDetails album={selectedAlbum} />
            </div>
          )}
        </>
      )}
  
      {isSongSearch && (
        <>
          <button className="back-button" onClick={handleBackClick}>Back</button>
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={handleSongSearch}
            className="search-input"
          />
          {suggestions.length > 0 && (
            <div className="autocomplete-container">
              <table className="autocomplete-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Length</th>
                    <th>Like</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((song, index) => (
                    <tr key={index} className="autocomplete-suggestion">
                      <td>{song.title}</td>
                      <td>{song.artist}</td>
                      <td>{song.album}</td>
                      <td>{song.length}</td>
                      <td>
                        <img
                          src={likes[song.title] ? heart3Image : heart1Image}
                          alt="Like"
                          className="duration-header"
                          onMouseOver={(e) => e.currentTarget.src = heart2Image}
                          onMouseOut={(e) => e.currentTarget.src = likes[song.title] ? heart3Image : heart1Image}
                          onClick={() => handleLikeClick(song.title)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default App;
