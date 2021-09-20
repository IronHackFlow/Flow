import React from 'react'

function Modal(props) {
  return (
    <div className="modal">
      <div className="modal-info">
        <div className="modal-info-inset">
          <div className="modal-info-outset">
            <ol className="modal-directions">
              <li className="modal-list-items">
                <p style={{ color: 'black', fontWeight: 'bold' }}>1.</p>
                <p>Hit the mic button to begin recording your track.</p>
              </li>
              <li className="modal-list-items">
                <p style={{ color: 'black', fontWeight: 'bold' }}>2.</p>
                <p>The lyrics you rap will populate the top of the screen.</p>
              </li>
              <li className="modal-list-items">
                <p style={{ color: 'black', fontWeight: 'bold' }}>3.</p>
                <p>
                  You will receive suggestions in the first of the two boxes located at the center.
                  Tap on a set of lyrics to pin them to the second box for later or to mix up the
                  rhyme scheme.
                </p>
              </li>
              <li className="modal-list-items">
                <p style={{ color: 'black', fontWeight: 'bold' }}>4.</p>
                <p>
                  After recording your song, you can hit the play button to play it back, or the
                  trash button to trash it and start over.
                </p>
              </li>
              <li className="modal-list-items">
                <p style={{ color: 'black', fontWeight: 'bold' }}>5.</p>
                <p>
                  Finally, you can hit the download button to save your track to your device. Happy
                  sharing!
                </p>
              </li>
            </ol>
            <button className="close-btn" type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Modal
