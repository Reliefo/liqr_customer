import io from "socket.io-client";



  const socket = io(
    "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo",
    {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODc2NjMxNjYsIm5iZiI6MTU4NzY2MzE2NiwianRpIjoiNDA4ZThhOGItYmUwMy00ZGMyLWJhYTQtZTUyZWNmYzM0NTYyIiwiZXhwIjoxNTg3Njc4MTY2LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.mRjiK9qbvPVKlsrVhwF8dCFJApyjWtnEe8J4qer6l60"
          }
        }
      }
    }
  );

export default socket;
