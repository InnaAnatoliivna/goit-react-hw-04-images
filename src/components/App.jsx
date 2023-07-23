import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './searchbar/searchbar';
import api from './service-api/pixabay-api';
import { toast } from 'react-toastify';
import ImageGallery from './imageGallery/imageGallery';
import Button from './button/button';
import Loader from './loader/loader';
import Modal from './modal/modal';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');// we got state 'searchQuery' from 'searchbar.js' (searchQueryOriginal=searchQuery)
  const [page, setPage] = useState(0);
  const [results, setResults] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [error, setError] = useState('')
  const prevQuery = useRef(searchQuery);
  const prevPage = useRef(page);

  useEffect(() => {
    const fetchData = async () => {
      setShowLoader(true);
      try {
        const data = await api.fetchImages(searchQuery, page);
        const totalPage = Math.ceil(data.totalHits / 12);
        setResults((prev) => [...prev, ...data.hits]);
        setShowLoadMore(data.totalHits > 12 * page);
        !data.totalHits && toast.error("No results found. Please try again!");
        page >= totalPage && toast.warning("We're sorry, but you've reached the end of search results!");
      } catch (error) {
        // setError(error.message);
        console.error(error.message);
      } finally {
        setShowLoader(false);
      }
    };

    if (prevQuery.current !== searchQuery || prevPage.current !== page) fetchData();
  }, [page, searchQuery]);

  function onFormSubmit(searchQueryOriginal) {
    setSearchQuery(searchQueryOriginal);
    setPage(1);
    setResults([]);
  }
  const onLoadMore = () => {
    if (results) setPage((prev => { return prev + 1 }))
  }
  const handleKeydown = e => {
    if (e.code === 'Escape') {
      setShowModal(false);
      setSelectedImage(null);
    }
  };
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setSelectedImage(null);
    }
  };
  const onOpenModal = imageId => {
    const selectedImage = results.find(image => image.id === imageId);
    setShowModal(true);
    setSelectedImage(selectedImage);
  }; // we got'imageId' from callback 'onOpenModal(imageId)' from 'imageGalleryItem.js'

  return (
    <div className='App'>
      <ToastContainer autoClose={5000} pauseOnHover theme="colored" />
      <Searchbar onSubmit={onFormSubmit} />
      {searchQuery === '' && <h2 className='empty'>Please enter a query to search for images!</h2>}
      {results && <ImageGallery arrayResults={results} onOpenModal={onOpenModal} />}
      {showLoadMore && <Button handleClick={onLoadMore}><span>Load More</span></Button>}
      {showLoader && <Loader />}
      {showModal && (
        <Modal
          onBackdropClose={handleBackdropClick}
          onKeydownClose={handleKeydown}
        >
          <img src={selectedImage.largeImageURL} alt="imageSearch" />
        </Modal>
      )}
    </div>
  );
};