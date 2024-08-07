import React, { useEffect, useState } from "react";
import { useStateProvider } from "../utils/StateProvider"; // Importing state provider hook
import axios from "axios"; // Axios for making API requests
import { reducerCases } from "../utils/Constant"; // Importing reducer action types
import styled from "styled-components"; // Styled-components for styling

// Playlists component fetches and displays user playlists from Spotify API
export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider(); // Destructuring state and dispatch function from state provider
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Effect to fetch playlists data when the component mounts or token changes
    const getPlayListData = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists", // Spotify API endpoint for user playlists
          {
            headers: {
              Authorization: "Bearer " + token, // Authorization header with token
              "Content-Type": "application/json",
            },
          }
        );
        const { items } = response.data; // Extracting playlists from response
        const playlists = items.map(({ name, id }) => ({ name, id })); // Mapping playlists to name and id
        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists }); // Dispatching action to set playlists in state
        setLoading(false); // Setting loading state to false
      } catch (error) {
        console.error("Error fetching playlists: ", error); // Logging error if fetch fails
        setLoading(false); // Setting loading state to false
      }
    };

    if (token) {
      getPlayListData(); // Calling function to fetch playlists when token is available
    }
  }, [token, dispatch]); // Dependencies: token and dispatch function

  // Conditional rendering based on loading state and playlists availability
  if (loading) {
    return <div>Loading...</div>; // Displaying loading message while fetching playlists
  }

  if (!playlists || playlists.length === 0) {
    return <div>No playlists available</div>; // Displaying message if no playlists are available
  }

  // Function to handle playlist selection and dispatch the selected playlist ID
  const changeCurrentPlayList = (selectedPlayListId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlayListId });
  };

  // Render playlists in a styled container
  return (
    <Container>
      <ul>
        {playlists.map(({ name, id }) => (
          <li key={id} onClick={() => changeCurrentPlayList(id)}>
            {name}
          </li>
        ))}
      </ul>
    </Container>
  );
}

// Styled component for container and list styling
const Container = styled.div`
  height: 100%;
  overflow: hidden;

  ul {
    list-style-type: none; 
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 52vh; 
    max-height: 100%; 
    overflow: auto; 
    &::-webkit-scrollbar {
      width: 0.7rem; 
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(
        255,
        255,
        255,
        0.6
      ); // Customizing scrollbar thumb color
    }

    li {
      display: flex;
      gap: 1rem; 
      cursor: pointer; 
      transition: 0.3s ease-in-out; 

      &:hover {
        color: white;
       }
    }
  }
`;
