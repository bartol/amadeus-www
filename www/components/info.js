import { useState } from "react";
import { Send } from "react-feather";

function Info({ h1Heading, dispatchAlert }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="flex mt-12">
      <div className="relative w-1/2" style={{ paddingBottom: "50%" }}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=17.43017435073853%2C43.05097977136855%2C17.44060277938843%2C43.05585217535902&amp;marker=43.0534178%2C17.4353940"
          className="absolute w-full h-full"
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
        ></iframe>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-2/3">
          {h1Heading ? (
            <h1 className="heading text-4xl ml-2 mt-12 mb-5">Amadeus II d.o.o. shop</h1>
          ) : (
            <h2 className="heading text-4xl ml-2 mb-5">Amadeus II d.o.o. shop</h2>
          )}
          <div className="card ~neutral !low flex flex-col items-start">
            <h3 className="subheading text-2xl mb-2">Kontaktirajte nas</h3>
            <input
              type="email"
              placeholder="Vaš email"
              className="input ~neutral !normal mb-3 w-auto"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              rows="4"
              placeholder="Poruka"
              className="textarea ~neutral !normal mb-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              type="button"
              className="button ~info !normal px-3 py-2"
              onClick={() => {
                dispatchAlert("Poruka uspješno poslana", "info", Send);
              }}
            >
              <Send />
              <span className="text-lg ml-2 lg:block hidden">Pošalji</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
