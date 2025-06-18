import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7, //balance is negative, i.e I owe money to Clark
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20, //balance is positive, i.e Sarah owes money to Me
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0, //balance is zero, i.e no one owes money
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false); //state to check if add friend form is open or not

  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend); //using callback function because the new value of state is depending on the current value of state.
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList />

        {showAddFriend ? <FormAddFriend /> : null}

        <Button handleClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      <FormSplitBill />
    </div>
  );
}

function FriendsList() {
  return (
    <ul>
      {initialFriends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />

      <div>
        <h3>{friend.name}</h3>

        {friend.balance > 0 ? (
          <p className="green">
            {friend.name} owes you ${friend.balance}
          </p>
        ) : friend.balance < 0 ? (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        ) : (
          <p>You and {friend.name} are even</p>
        )}
      </div>

      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend() {
  return (
    <form className="form-add-friend">
      <label>👭 Friend name</label>
      <input type="text"></input>

      <label>🌆 Image url</label>
      <input type="text"></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>split a bill with X</h2>

      <label>💰 Bill value </label>
      <input type="text"></input>

      <label>🧍‍♂️ Your expense </label>
      <input type="text"></input>

      <label>👭 X's expense: </label>
      <input type="text" disabled></input>

      <label>🤑 Who is paying the bill ? </label>
      <select>
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

// Reusable components
function Button({ handleClick, children }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}
