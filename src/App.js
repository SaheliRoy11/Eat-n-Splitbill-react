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
  const [friends, setFriends] = useState(initialFriends); //list of friends (initialised with some random data)
  const [curSelectedFriend, setCurSelectedFriend] = useState(null); //friend object whose bill is open currently.Initially it is null because no bill is open when page is loaded first time.

  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend); //using callback function because the new value of state is depending on the current value of state.
  }

  function handleAddFriend(newFriend) {
    //use callback function because we need to work on current array to create a new Array and send it back.Remember, never mutate original array then React will not know about it and hence not re-render.
    setFriends((friends) => [...friends, newFriend]);

    setShowAddFriend(false); //after adding a new friend, close the FormAddFriend
  }

  function handleSelectFriend(selectedFriend) {
    setCurSelectedFriend(selectedFriend);
    setShowAddFriend(false); //when we open bill for spliting the money, the form for adding a new friend needs to be closed always.
  }

  function handleSplitBill(value) {
    setFriends(
      (
        friends //new array depends on current state hence using callback
      ) =>
        friends.map((friend) =>
          friend.id === curSelectedFriend.id
            ? { ...friend, balance: friend.balance + value }
            : friend
        )
    );

    setCurSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          curSelectedFriend={curSelectedFriend}
        />

        {showAddFriend ? (
          <FormAddFriend friends={friends} onAddFriend={handleAddFriend} />
        ) : null}

        <Button handleClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {
        //if curSelectedFriend is null then the FormSplitBill component is not rendered.
        curSelectedFriend && (
          <FormSplitBill
            selectedFriend={curSelectedFriend}
            onSplitBill={handleSplitBill}
          />
        )
      }
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, curSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelectFriend={onSelectFriend}
          curSelectedFriend={curSelectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, curSelectedFriend }) {
  const isSelected = curSelectedFriend?.id === friend.id; //concept of optional chaining, when curSelectedFriend is null.

  return (
    <li className={isSelected ? "selected" : ""}>
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

      <Button
        handleClick={() =>
          onSelectFriend(
            isSelected
              ? null //if this friend component is already selected then now, it needs to close
              : friend
          )
        }
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48"); //initial part of the url

  function createFriend(e) {
    e.preventDefault();

    if (!name || !url) return;

    const newFriendId = crypto.randomUUID(); //inbuilt
    const newFriend = {
      id: newFriendId,
      name,
      image: `${url}?=${newFriendId}`, //this is just how the website works
      balance: 0,
    };

    onAddFriend(newFriend);

    //reset to default values
    setName("");
    setUrl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={createFriend}>
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🌆 Image url</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState(""); //since we used input type text, hence set defaul to empty string
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : ""; //initially bill is empty string
  const [payer, setPayer] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill) return;

    onSplitBill(payer === "user" ? friendExpense : 0 - userExpense);//if the user pays the bill then the friend owes their part to the user, otherwise the user owes their part to their friend.
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>🧍‍♂️ Your expense </label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            //prevents putting a value greater than the total bill, and if we try to then it sets the state to its current value and does not update with the value we are entering.
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      ></input>

      <label>👭 {selectedFriend.name}'s expense: </label>
      <input type="text" disabled value={friendExpense}></input>

      <label>🤑 Who is paying the bill ? </label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
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
