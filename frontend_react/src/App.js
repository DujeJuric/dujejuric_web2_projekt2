import "./App.css";
import { useState } from "react";
import { useRef } from "react";
import ReCaptcha from "react-google-recaptcha";

function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [email1, setEmail1] = useState("");
  const [password1, setPassword1] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  const [chosen, setChosen] = useState("sql");
  const [chosenSec, setChosenSec] = useState("vulnerable");
  const bruteFrocePasswordList = [
    "password",
    "123456",
    "12345678",
    "1234",
    "qwerty",
    "12345",
    "dragon",
    "cat",
    "dog",
    "password1",
    "password2",
    "pass",
  ];
  const bruteForceEmail = "test.user@gmail.com";
  const [bruteForcePassword, setBruteForcePassword] = useState("");
  const [status, setStatus] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState(null);
  const recaptchaRef = useRef();
  const buttonRef = useRef();
  const bruteForceRef = useRef();

  const login1 = async (event) => {
    event.preventDefault();

    //check if email and password are empty
    if (email1 === "" || password1 === "") {
      alert("Please fill in all fields.");
      return;
    }

    const url =
      chosenSec === "vulnerable"
        ? "http://localhost:8000/getUserVulnerable"
        : "http://localhost:8000/getUserSecure";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email1,
        password: password1,
      }),
    });
    const data = await response.json();
    if (data.detail) {
      setStatus("No user found.");
    } else {
      setStatus("User: [" + data.email + "] successfully logged in.");
    }
    setEmail1("");
    setPassword1("");
  };

  const login2 = async (event) => {
    event.preventDefault();

    if (email2 === "" || password2 === "") {
      alert("Please fill in all fields.");
      return;
    }

    const response = await fetch(
      "http://localhost:8000/getUserBruteForceExample",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email2,
          password: password2,
        }),
      }
    );
    const data = await response.json();

    if (data.detail) {
      setStatus("No user found.");
    } else {
      setStatus("User: [" + data.email + "] successfully logged in.");
    }
    setEmail2("");
    setPassword2("");

    if (chosenSec === "Secure") {
      setCaptchaStatus(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  const bruteForceLogin = async () => {
    bruteForceRef.current.disabled = true;
    for (const password of bruteFrocePasswordList) {
      setBruteForcePassword(password);
      setPassword2(password);
      setEmail2(bruteForceEmail);
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (buttonRef.current.disabled) {
        setStatus("Brute force attack stopped. Captcha required.");
        break;
      }
      buttonRef.current.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    bruteForceRef.current.disabled = false;
    setBruteForcePassword("");
  };

  return (
    <div className="App">
      <div className="choiceDiv">
        <h1>Odaberite vrstu napada</h1>
        <div>
          <button
            onClick={() => {
              setChosen("sql");
              setStatus("");
            }}
            className={chosen == "sql" ? "highlight" : "notH"}
          >
            SQL UMETANJE
          </button>
          <button
            onClick={() => {
              setChosen("broken");
              setStatus("");
            }}
            className={chosen == "broken" ? "highlight" : "notH"}
          >
            LOŠA AUTENTIFIKACIJA
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setChosenSec("vulnerable");
              setStatus("");
            }}
            className={chosenSec == "vulnerable" ? "highlight" : "notH"}
          >
            Ranjivo
          </button>
          <button
            onClick={() => {
              setChosenSec("Secure");
              setStatus("");
            }}
            className={chosenSec == "Secure" ? "highlight" : "notH"}
          >
            Sigurno
          </button>
        </div>
      </div>

      {chosen === "sql" && (
        <div className="example1">
          <h1>LOGIN</h1>
          <form className="inputForm">
            <input
              type="text"
              placeholder="Email"
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <button onClick={login1}>Login</button>
          </form>
          <h2>Status: {status}</h2>
        </div>
      )}

      {chosen === "broken" && (
        <div className="example2">
          <h1>LOGIN</h1>
          <form className="inputForm">
            <input
              type="text"
              placeholder="Email"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {chosenSec === "Secure" && (
              <ReCaptcha
                ref={recaptchaRef}
                sitekey="6Lfsq3oqAAAAABo5KEcmBB3GFBG0isQAIFGKOQZG"
                onChange={(e) => setCaptchaStatus(e)}
              />
            )}
            {chosenSec === "Secure" ? (
              <button
                onClick={login2}
                disabled={!captchaStatus}
                ref={buttonRef}
              >
                Login
              </button>
            ) : (
              <button onClick={login2} ref={buttonRef}>
                Login
              </button>
            )}
          </form>
          <div>
            <button onClick={bruteForceLogin} ref={bruteForceRef}>
              Pokreni Brute Force napad
            </button>
            {bruteForcePassword && (
              <h3>Trying password: {bruteForcePassword}</h3>
            )}
            <h2>Status: {status}</h2>
          </div>
        </div>
      )}
      <div>
        <h1>Upute</h1>
        {chosen === "sql" && (
          <div className="upute">
            <h4>
              U bazi postoji korisnik s emailom{" "}
              <mark>"test.user@gmail.com"</mark> i lozinkom
              <mark>"pass"</mark>. Za početak testirajte login unos s ispravnim
              podacima. Status ispod login forme prikazuje uspješnost logiranja.
            </h4>
            <h3>1. Demonstracija ranjivog upita.</h3>
            <h4>
              Odaberite opciju <mark>"Ranjivo"</mark> klikom na gumb. U bilo
              koje polje unesite <mark>' OR 1=1 --</mark> i isprobajte login.
              Kao odgovor status bi trebao prikazivati uspješan login.
            </h4>
            <h3>2. Demonstracija sigurnog upita.</h3>
            <h4>
              Odaberite opciju <mark>"Sigurno"</mark> klikom na gumb. U bilo
              koje polje unesite <mark>' OR 1=1 --</mark> i isprobajte login.
              Kao odgovor status bi trebao prikazivati neuspješan login.
            </h4>
            <h3>Obrazloženje</h3>
            <h4>
              Ovisno o odabiru sigurnosti, upit će se poslati na različit
              endpoint. U prvom slučaju, upit će se poslati na ranjiv endpoint
              gdje se SQL upit izravno izvršava na bazi podataka bez ikakve
              provjere. U drugom slučaju, upit će se poslati na siguran endpoint
              gdje se SQL upit parametrizira koristeći ORM alat, te zatim šalje
              na bazu podataka.
            </h4>
          </div>
        )}
        {chosen === "broken" && (
          <div className="upute">
            <h4>
              U bazi postoji korisnik s emailom{" "}
              <mark>"test.user@gmail.com"</mark> i lozinkom
              <mark>"pass"</mark>. Za početak testirajte login unos s ispravnim
              podacima. Status ispod login forme prikazuje uspješnost logiranja.
            </h4>
            <h4>
              Kao demonstracija loše autentifikacije, implementiran je Brute
              Force napad na login formu. Klikom na gumb{" "}
              <mark>"Pokreni Brute Force napad"</mark> aplikacija će testirati
              lozinke iz testne liste na login formi.
            </h4>
            <h3>1. Demonstracija ranjivosti.</h3>
            <h4>
              Odaberite opciju <mark>"Ranjivo"</mark> klikom na gumb. Kliknite
              na gumb brute forca napada i promatrajte status ispod forme.
              Trenutno ne postoji nikakva zaštita od brute force napada, što
              omogućuje napadaču (uz znanje postojećeg emaila) da isprobava
              različite kombinacije lozinki na brz i jednostavan način putem
              automatizirane skripte.
            </h4>
            <h3>2. Demonstracija sigurnog pristupa.</h3>
            <h4>
              Odaberite opciju <mark>"Sigurno"</mark> klikom na gumb. Ispunite
              ručno login formu i kliknite na gumb login. Login forma sada
              zahtjeva i captcha provjeru, koja sprječava klikanje na gumb login
              u slučaju kada nije ispunjena. Probajte pokrenuti i brute force
              koji sada neće biti uspješan.
            </h4>
            <h3>Obrazloženje</h3>
            <h4>
              U prvom slučaju, login forma je ranjiva na brute force napade jer
              ne postoji nikakva zaštita od istih. U drugom slučaju, login forma
              je zaštićena captcha provjerom koja sprječava automatizirane
              napade na login formu. Naime koristeći automatiziranu skriptu,
              nije moguće rješiti captcha provjeru, što sprječava napadača da
              isprobava različite kombinacije lozinki na login formi.
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
