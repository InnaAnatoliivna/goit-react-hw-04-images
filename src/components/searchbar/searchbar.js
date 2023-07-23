import { useState } from 'react';
import '../../index.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const Searchbar = ({ onSubmit }) => {
    const [searchQueryOriginal, setSearchQueryOriginal] = useState('');//here we create our 'searchQuery', then pass it to App
    const handleChange = (e) => {
        setSearchQueryOriginal(e.currentTarget.value.toLowerCase().trim())
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQueryOriginal === '') {
            toast.warning('Enter a search query!');
            return
        }
        onSubmit(searchQueryOriginal);
        setSearchQueryOriginal('');
    }

    return (
        <header className="Searchbar" >
            <form className="SearchForm" onSubmit={handleSubmit}>
                <button type="submit" className="SearchForm-button">
                    <span className="SearchForm-button-label"></span>
                </button>
                <input
                    className="SearchForm-input"
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    onChange={handleChange}
                    value={searchQueryOriginal}
                />
            </form>
        </header>
    )
}
export default Searchbar;

Searchbar.propTypes = {
    onSubmit: PropTypes.func
}