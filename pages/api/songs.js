async function songs(request, response) {
    const dynamicDate = new Date();

    const songsResponse = await fetch("https://project-unlimited.glitch.me/songdb/v1/songs")
    const songsResponseJson = await songsResponse.json();
    const Monster = songsResponseJson.artist;

    response.json({
        Monster: Monster
    });
}

export default songs;