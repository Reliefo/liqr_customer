import io from "socket.io-client";



  const socket = io(
    "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo",
    {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODc1NzAxNjcsIm5iZiI6MTU4NzU3MDE2NywianRpIjoiNTU2ZmU4NTEtOTBhOS00NzJmLWIxNTctMzRmMTJkNjUzZDM1IiwiZXhwIjoxNTg3NTg1MTY3LCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.B_Z0tOnHj0fHOwP6o1TsNsMPxkF0mi8NQXz6hPKRm_E"
          }
        }
      }
    }
  );

export default socket;