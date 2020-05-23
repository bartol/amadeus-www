import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { UPLOAD_IMAGE } from '../queries/UPLOAD_IMAGE';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export const Imgs = ({ item, setItem }: any) => {
  const [localUpload, setLocalUpload] = useState('');

  // @ts-ignore
  const cropper = React.useRef(null);

  const [isOpened, setIsOpened] = useState(false);

  const [uploadImage, { data }] = useMutation(UPLOAD_IMAGE);

  useEffect(() => {
    if (data && !item.images.includes(data.uploadImage)) {
      setItem({
        ...item,
        images: [
          ...item.images,
          {
            src: data.uploadImage,
            index: item.images.length
              ? item.images[item.images.length - 1].index + 1
              : 1,
          },
        ],
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setItem({
      ...item,
      images: item.images.sort((a: any, b: any) => a.index - b.index),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.images]);

  return (
    <div>
      <button
        type='button'
        onClick={() => setIsOpened(true)}
        className='linkBtn link addImgBtn'
      >
        dodaj sliku
      </button>
      {isOpened && (
        <div className='uploadWrapper'>
          <button
            type='button'
            onClick={() => {
              setIsOpened(false);
              setLocalUpload('');
              // @ts-ignore
              document.getElementById('imgUpload').value = '';
            }}
            className='x linkBtn link'
          >
            X
          </button>
          <div className='file_inputs'>
            <input
              type='file'
              id='imgUpload'
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  const reader = new FileReader();
                  reader.addEventListener('load', () =>
                    // @ts-ignore
                    setLocalUpload(reader.result),
                  );
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <span>or</span>
            <span
              contentEditable
              className='paste_img_here'
              onPaste={e => {
                e.preventDefault();
                for (let i = 0; i < e.clipboardData.items.length; i++) {
                  if (e.clipboardData.items[i].kind === 'file') {
                    const blob = e.clipboardData.items[i].getAsFile();
                    const reader = new FileReader();
                    reader.addEventListener('load', () =>
                      // @ts-ignore
                      setLocalUpload(reader.result),
                    );
                    // @ts-ignore
                    reader.readAsDataURL(blob);
                    break;
                  }
                }
              }}
            >
              paste image here
            </span>
          </div>
          <br />
          <Cropper
            // @ts-ignore
            ref={cropper}
            src={localUpload}
            style={{ height: '80%', width: '100%' }}
            aspectRatio={4 / 3}
            guides={false}
          />
          {localUpload && cropper.current && (
            <button
              type='button'
              onClick={() => {
                // @ts-ignore
                const base64 = cropper.current.getCroppedCanvas().toDataURL();
                uploadImage({
                  variables: {
                    base64,
                    name: item.slug.hr,
                  },
                });
                setIsOpened(false);
                setLocalUpload('');
                // @ts-ignore
                document.getElementById('imgUpload').value = '';
              }}
              className='link linkBtn'
            >
              Save image
            </button>
          )}
        </div>
      )}

      <div className='imageList'>
        {item.images.map((image: any) => {
          return (
            <div key={image.src} className='imageWrapper'>
              <img src={image.src} alt='item' className='image' />

              <div>
                <button
                  type='button'
                  disabled={image.index === 1}
                  onClick={() => {
                    const images = item.images.map((img: any) => {
                      // if (image.index === 1) {
                      // return img;
                      // }
                      if (img.index === image.index) {
                        return {
                          src: img.src,
                          index: img.index - 1,
                        };
                      }
                      if (img.index === image.index - 1) {
                        return {
                          src: img.src,
                          index: img.index + 1,
                        };
                      }
                      return img;
                    });

                    setItem({
                      ...item,
                      images,
                    });
                  }}
                >
                  &#9664;
                </button>
                {image.index}
                <button
                  type='button'
                  disabled={image.index === item.images.length}
                  onClick={() => {
                    const images = item.images.map((img: any) => {
                      // if (image.index === item.images.length) {
                      // return img;
                      // }
                      if (img.index === image.index) {
                        return {
                          src: img.src,
                          index: img.index + 1,
                        };
                      }
                      if (img.index === image.index + 1) {
                        return {
                          src: img.src,
                          index: img.index - 1,
                        };
                      }
                      return img;
                    });

                    setItem({
                      ...item,
                      images,
                    });
                  }}
                >
                  &#9654;
                </button>
                <button
                  type='button'
                  onClick={() => {
                    const images = item.images
                      .filter((img: any) => img.src !== image.src)
                      .map((img: any) => {
                        if (img.index > image.index) {
                          return {
                            src: img.src,
                            index: img.index - 1,
                          };
                        }
                        return img;
                      });

                    setItem({
                      ...item,
                      images,
                    });
                  }}
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
