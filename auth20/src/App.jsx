import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function getdata() {
  let newdb = localStorage.getItem("apurv_data");
  if (newdb) {
    return JSON.parse(localStorage.getItem("apurv_data"));
  } else {
    return [];
  }
}

function App() {
  const [txt, settxt] = useState("");
  const [list, setlist] = useState(getdata());
  const [toggle, settoggle] = useState(true);
  const [edited, setedited] = useState("");
  const [search, setsearch] = useState("");

  const { logout, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const dt = new Date().toLocaleDateString();
  const ct = new Date().toLocaleTimeString();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  function added() {
    if (txt.length < 1) {
      alert("Please enter something");
      return;
    }
    if (toggle) {
      setlist([
        {
          txt,
          year: dt,
          time: ct,
          checked: false,
          locked: false,
          password: "",
          pinned: false,
        },
        ...list,
      ]);
    } else {
      const update2 = [...list];
      update2[edited] = {
        txt,
        year: dt,
        time: ct,
        checked: false,
        locked: false,
        password: "",
      };
      setlist(update2);
      settoggle(true);
    }

    settxt("");
  }

  function press(e) {
    if (e.key === "Enter") {
      added();
    }
  }

  function remove(key) {
    const update1 = list.filter((_, b) => b !== key);
    setlist(update1);
  }

  function edit(key) {
    if (list[key].locked) {
      const inputPassword = prompt("Enter the password to edit this note:");
      if (inputPassword !== list[key].password) {
        alert("Incorrect password!");
        return;
      }
    }
    settxt(list[key].txt);
    settoggle(false);
    setedited(key);
  }

  function handleLock(key) {
    const updatedList = [...list];
    if (updatedList[key].locked) {
      const inputPassword = prompt("Enter the password to unlock this note:");
      if (inputPassword === updatedList[key].password) {
        updatedList[key].locked = false;
        updatedList[key].password = "";
        setlist(updatedList);
      } else {
        alert("Incorrect password!");
      }
    } else {
      const password = prompt("Set a password to lock this note:");
      if (password) {
        updatedList[key].locked = true;
        updatedList[key].password = password;
        setlist(updatedList);
      }
    }
  }

  function handlecheck(ide) {
    const update3 = [...list];
    update3[ide].checked = !update3[ide].checked;
    setlist(update3);
  }

  function togglePin(key) {
    const updatedList = [...list];
    updatedList[key].pinned = !updatedList[key].pinned;
    setlist(updatedList);
  }
  

// new code updates

const shareNote = (note) => {
  // Create a simple shareable text
  const shareText = `Note from ${user?.name}:\n${note.txt}\nCreated on: ${note.year} at ${note.time}`;
  
  // Check if the Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'Shared Note',
      text: shareText,
    }).catch(err => {
      console.log('Error sharing:', err);
      // Fallback to clipboard
      copyToClipboard(shareText);
    });
  } else {
    // Fallback to clipboard
    copyToClipboard(shareText);
  }
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      Swal.fire({
        title: 'Copied!',
        text: 'Note has been copied to clipboard',
        icon: 'success',
        timer: 2000
      });
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to copy note',
        icon: 'error'
      });
    });
};






  //new code always
  const searchData = list
  .map((item, index) => ({ ...item, originalIndex: index })) 
  .filter((item) => item.txt.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => b.pinned - a.pinned);



  useEffect(() => {
    localStorage.setItem("apurv_data", JSON.stringify(list));
  }, [list]);

  function removeall() {
    setlist([]);
  }

  return (
    <div className="app-container">
      <div className="header">
        <h5>Apurv-notes app</h5>
        <div className="user-info">
          <span>
            🟢{user?.name}
            <img src={user?.picture} className="user-picture" />
          </span>
          <button
            onClick={() =>
              Swal.fire({
                title: `Are you sure?, ${user?.name}`,
                text: "You won't be able to revert this!",
                imageUrl: `${user.picture}` ,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, log out!",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Logged out!",
                    text: "You have been logged out.",
                    icon: "success",
                  }).then(() => {
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                  });
                }
              })
            }
            className="logout-btn"
          >
            {" "}
            Logout{" "}
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="enter ur notes"
        onChange={(e) => {
          settxt(e.target.value);
        }}
        value={txt}
        onKeyUp={press}
      />
      {toggle ? (
        <button onClick={added}>Add</button>
      ) : (
        <button onClick={added}>🆗</button>
      )}

      <input
        type="text"
        placeholder="🔍 search ur notes"
        onChange={(e) => {
          setsearch(e.target.value);
        }}
        value={search}
      />

{searchData.map((data, id) => (
  <div key={id} className="task-container">
    <button onClick={() => togglePin(data.originalIndex)}>
      {data.pinned ? "📍" : "📌"}
    </button>

    <input
      type="checkbox"
      checked={data.checked}
      onChange={() => handlecheck(data.originalIndex)}
      disabled={data.locked}
    />

    {data.locked ? (
      <span className="locked-note"> Locked</span>
    ) : (
      <span className={data.checked ? "strike" : ""}>{data.txt}</span>
    )}

    <p>
      {data.year} {data.time}
    </p>

    <button onClick={() => remove(data.originalIndex)}>❌</button>
    <button onClick={() => edit(data.originalIndex)}>✏️</button>
    <button onClick={() => handleLock(data.originalIndex)}>
      {data.locked ? "🔓" : "🔒"}
    </button>
    <button onClick={() => shareNote(data)}>📤</button>
  </div>
))}

      <button onClick={removeall}>Remove all</button>
    </div>
  );
}

export default App;
