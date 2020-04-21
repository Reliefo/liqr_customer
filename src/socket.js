import io from "socket.io-client";



  const socket = io(
    "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo",
    {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODc0Mzk5ODcsIm5iZiI6MTU4NzQzOTk4NywianRpIjoiMjc2M2M3YmEtMzE5YS00ZWQwLWI5OWItOWMxNjI4MGI3NGRlIiwiZXhwIjoxNTg3NDU0OTg3LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.0cWzad0BJaIlYcHduzi-75CmeRxtQ2fRX9nUxRsQA4I"
          }
        }
      }
    }
  );

export default socket;