import axios from "axios";

const googleLogin = async (accesstoken) => {
    let res = await axios.post(
      "http://localhost:9000/rest-auth/google/",
      {
        access_token: accesstoken,
      }
    );
    console.log("post results = ")
    console.log(res);
    return await res.status;
  };

export default googleLogin;