import React, { useState, useEffect, forwardRef, useRef } from "react";
import FlipMove from "react-flip-move";
import { keyupListener, keyCodes, focus } from "../core/index";
import { useDispatch, useSelector } from "react-redux";

import firebase from "firebase/app";
import { db, storageRef, storage } from "../config";

function Messenger(props) {
  const { room, orderDetails } = props;

  //console.log(orderDetails)

  const [input, setInput] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [messages, setMessages] = useState([]);

  const generalReducers = useSelector((state) => state);
  const { userInfo, buyStatus } = generalReducers;
  const { user } = userInfo;
  const dummy = useRef();

  useEffect(() => {
    _getMessages();
  }, []);

  const _getMessages = () => {
    db.collection(room)
      .where("orderId", "==", orderDetails._id)
      .orderBy("currentTime", "asc")
      .onSnapshot((snp) => {
        setMessages(
          snp.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });
  };

  const sendMessages = () => {
    if (buyStatus == "escrow" || buyStatus == "paid") {
      if (input == "" && fileUrl == null) {
        focus("._input");
      } else {
        if (room == "sellToBuy") {
          db.collection(room).add({
            msg: input,
            user: user.email,
            orderId: orderDetails._id,
            sellerId: orderDetails.email,
            buyerId: orderDetails.buyerId,
            buyOrder: orderDetails.buyOrder,
            fileUrl: fileUrl,
            currentTime: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
        if (room == "buyToSell") {
          db.collection(room).add({
            msg: input,
            user: user.email,
            orderId: orderDetails._id,
            sellerId: orderDetails.sellerId,
            buyerId: orderDetails.email,
            buyOrder: orderDetails.sellOffer,
            currentTime: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
        setInput("");
        dummy.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
          alignToTop: false,
        });
      }
    } else {
      <></>;
    }
  };

  //console.log(messages)

  /* Messages */
  const Messages = forwardRef(({ message }, ref) => {
    const isUser = user.email === message.user;

    const downloadFile = async (fileUrl) => {
      //console.log('url:', fileUrl)
      //let _ref = storage.ref(fileUrl);
      storage
        .refFromURL(fileUrl)
        .getDownloadURL()
        .then((url) => {
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function (event) {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = url;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click(); //Simulates a click event
            var blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
        });
    };

    return (
      <div className={`message-blk flex aic amim ${isUser ? "user" : "frd"}`}>
        {message.fileUrl == null || message.fileUrl == "" ? (
          <div ref={ref} className="item">
            <div className={`txt font s14 c333 ${isUser && "user-txt"}`}>
              {message.msg}
            </div>
          </div>
        ) : message.msg == "" || message.msg == null ? (
          <div ref={ref} className="item">
            <button
              className="cleanbtn"
              type="submit"
              onClick={() => {
                downloadFile(message.fileUrl);
              }}
            >
              {/*<img src={message.fileUrl} className="file" />*/}
              <div
                className="file"
                style={{ backgroundImage: `url(${message.fileUrl})` }}
              />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  });

  /*Generate Random ID*/
  const generateID = () => {
    var min = 1000;
    var max = 999999999999;
    var rand = Math.floor(Math.random() * (max - min)) + min;
    return rand;
  };

  /* Upload Files */
  const _uploadFile = async (e) => {
    let file = e.target.files[0];
    var ext = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();
    const fileNname = generateID() + "." + ext;

    const storageRef = storage.ref();
    const fileRef = storageRef.child(fileNname);
    await fileRef.put(file).then(() => {
      console.log("Uploaded File", fileNname);
    });
    setFileUrl(await fileRef.getDownloadURL());
  };

  return (
    <div className="messenger flex flex-col rel">
      {user ? (
        <React.Fragment>
          {buyStatus == "escrow" || buyStatus == "paid" ? (
            user && (
              <div className="wrap flex flex-col">
                <FlipMove>
                  {messages.map((data, index) => (
                    <Messages key={index} message={data} />
                  ))}
                </FlipMove>
                <div ref={dummy}></div>
              </div>
            )
          ) : (
            <div className="wrap flex flex-col"></div>
          )}
          <div className="msf-ftr flex aic fixed">
            <div className="feild flex aic">
              <input
                type="text"
                className={`cleanbtn iput _input font s15 c000 anim ${
                  buyStatus != "escrow" && buyStatus != "paid" && "disble"
                }`}
                placeholder="Type a message"
                value={input}
                disabled={buyStatus != "escrow" && buyStatus != "paid"}
                onKeyUp={(e) => {
                  keyupListener(e, keyCodes.ENTER, () => {
                    sendMessages();
                  });
                }}
                onChange={(e) => setInput(e.target.value)}
              />
              <input
                id="file_upload"
                multiple={true}
                className="iputhidden fixed reset"
                type="file"
                onChange={(e) => {
                  _uploadFile(e);
                }}
              />
              <button
                onClick={() => {
                  document.getElementById("file_upload").click();
                }}
                className="cleanbtn file-btn s20 c777 icon-paperclip"
              />
            </div>
            <button
              onClick={sendMessages}
              className={`cleanbtn btn icon-send s22 cfff flex aic ${
                buyStatus != "escrow" && buyStatus != "paid" && "disble"
              }`}
              disabled={buyStatus != "escrow" && buyStatus != "paid"}
            />
          </div>
          <div className="cleanftr" />
        </React.Fragment>
      ) : (
        <div className="empty font s15 c000">Message Box</div>
      )}
    </div>
  );
}

export default Messenger;
