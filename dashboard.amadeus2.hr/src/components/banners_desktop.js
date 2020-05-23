import React, { useRef, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { UPLOAD_BANNER } from '../queries/UPLOAD_BANNER';
import { DELETE_BANNER } from '../queries/DELETE_BANNER';

export const Banners = () => {
  const [localUpload_desktop, setLocalUpload_desktop] = useState('');

  // @ts-ignore
  const cropper_desktop = useRef(null);

  const [isOpened, setIsOpened] = useState(false);

  const [uploadBanner, { data }] = useMutation(UPLOAD_BANNER);
  const [deleteBanner, { data: del_data }] = useMutation(DELETE_BANNER);

  const [link_desktop, setLink_desktop] = useState({
    hr: '',
    en: '',
  });

  const get_banners = async () => {
    const bannersListURL =
      'https://amadeus-images.s3.amazonaws.com/banners.json';
    const bannersList = await fetch(bannersListURL).then(res => res.json());
    setBanners(bannersList);
  };

  const [banners, setBanners] = useState(get_banners);

  useEffect(() => {
    get_banners();

    setTimeout(function() {
      get_banners();
    }, 2000);

    setTimeout(function() {
      get_banners();
    }, 8000);
  }, [data, del_data]);

  return (
    <div style={{ margin: '2rem' }}>
      <div>
        <h2>Desktop</h2>
        {banners && banners.desktop
          ? banners.desktop.map(banner => {
              return (
                <div
                  key={banner.src}
                  style={{ display: 'flex', margin: '2rem 0' }}
                >
                  <img
                    src={banner.src}
                    width='50%'
                    style={{ marginRight: '2rem' }}
                    alt={banner.src}
                  />
                  <div>
                    <h3 style={{ margin: '0.5rem 0' }}>Links:</h3>
                    <br />
                    <span>
                      hr:{' '}
                      <a
                        href={`https://amadeus2.hr${banner.link.hr}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        https://amadeus2.hr{banner.link.hr}
                      </a>
                    </span>
                    <br />
                    <span>
                      en:{' '}
                      <a
                        href={`https://amadeus2.hr${banner.link.en}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        https://amadeus2.hr{banner.link.en}
                      </a>
                    </span>
                    <br />
                    <button
                      type='button'
                      onClick={() => {
                        deleteBanner({
                          variables: {
                            src: banner.src,
                            platform: 'desktop',
                          },
                        });
                      }}
                    >
                      remove
                    </button>
                  </div>
                </div>
              );
            })
          : null}

        <h4>Links:</h4>
        <span>
          hr:{' '}
          <input
            type='text'
            onChange={e =>
              setLink_desktop({
                ...link_desktop,
                hr: e.target.value,
              })
            }
            value={link_desktop.hr}
          />{' '}
          <a
            href={`https://amadeus2.hr${link_desktop.hr}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            https://amadeus2.hr{link_desktop.hr}
          </a>
        </span>
        <br />
        <span>
          en:{' '}
          <input
            type='text'
            onChange={e =>
              setLink_desktop({
                ...link_desktop,
                en: e.target.value,
              })
            }
            value={link_desktop.en}
          />{' '}
          <a
            href={`https://amadeus2.hr${link_desktop.en}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            https://amadeus2.hr{link_desktop.en}
          </a>
        </span>
        <br />

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
                setLocalUpload_desktop('');
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
                      setLocalUpload_desktop(reader.result),
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
                        setLocalUpload_desktop(reader.result),
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
              ref={cropper_desktop}
              src={localUpload_desktop}
              style={{ height: '80%', width: '100%' }}
              aspectRatio={3 / 1}
              guides={false}
            />
            {localUpload_desktop && cropper_desktop.current && (
              <button
                type='button'
                onClick={() => {
                  // @ts-ignore
                  const base64 = cropper_desktop.current
                    .getCroppedCanvas()
                    .toDataURL()
                    .toString();
                  uploadBanner({
                    variables: {
                      base64,
                      link: {
                        hr: link_desktop.hr,
                        en: link_desktop.en,
                      },
                      platform: 'desktop',
                    },
                  });
                  setIsOpened(false);
                  setLocalUpload_desktop('');
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
        {data && data.uploadBanner}
      </div>
    </div>
  );
};
