import { useEffect, useState } from "react";
import "./App.css";
import apiClient, { CanceledError } from "./services/api-client";
import userService, { User } from "./services/user-service";



function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const {request, cancel} = userService.getAllUsers()
      request.then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return ()=>cancel();
  }, []);


  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((item) => item.id !== user.id));
    userService.deleteUser(user.id)
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };


  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Manoochehr Khatami" };
    setUsers([newUser, ...users]);

    userService.createUser(newUser)
      .then((res) => setUsers([res.data, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user:User) => {
    const originalUsers = [...users];
    const updatedUser = {...user, name: user.name + '!'}
    setUsers(users.map(u=> u.id === user.id ? updatedUser : u));

    userService.updateUser(user)
    .catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  }
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <button className="btn btn-primary mb-3" onClick={addUser}>
        Add
      </button>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {user.name}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                UPDATE
              </button>
              <button
                onClick={() => deleteUser(user)}
                className="btn btn-outline-danger"
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
// 'https://jsonplaceholder.typicode.com/users'
