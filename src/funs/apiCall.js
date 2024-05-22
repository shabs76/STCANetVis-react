import axios from "axios";

export const sendToBackendPost = async (link, data) => {
    let ansbck;
    ansbck = await axios.post('http://localhost:390'+link, data, {
        headers: {
            'content-type': 'text/json',
        },
        withCredentials: true,
    }).catch((e) => {
        console.log(e);
        ansbck = {
            state: 'error',
            data: 'Network error',
        };
        return ansbck;
    });
    console.log(ansbck);
    if (typeof (ansbck)  === 'object') {
        return ansbck.data;
    }
    return ansbck;
}

// https://scanet.api.brentles.co.tz