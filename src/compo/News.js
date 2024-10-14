import React, { Component } from 'react';
import Newsitem from './Newsitem';

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.fetchNews();
  }

  // Function to fetch news articles using Currents API
  fetchNews = async () => {
    const { page } = this.state;
    try {
      let url = `https://api.currentsapi.services/v1/latest-news?page_number=${page}&apiKey=R6KPo2UKHOlQtOVTkbUGkGh6CFNHXax8tc_67LORdkvioeEF`;
      this.setState({ loading: true });
      let data = await fetch(url);
      
      // Checking if the response is OK (status 200)
      if (!data.ok) {
        throw new Error(`Error fetching data: ${data.statusText}`);
      }
  
      let parsedData = await data.json();
      console.log(parsedData); // Log the API response
  
      this.setState({
        articles: parsedData.news || [], // If parsedData.news is undefined, use an empty array
        totalResults: parsedData.news.length || 0, // Set totalResults based on the number of articles
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false }); // Stop loading state in case of an error
    }
  };
  

  handleNext = () => {
    this.setState(
      (prevState) => ({
        page: prevState.page + 1,
      }),
      () => {
        this.fetchNews();
      }
    );
  };

  handlePrev = () => {
    if (this.state.page > 1) {
      this.setState(
        (prevState) => ({
          page: prevState.page - 1,
        }),
        () => {
          this.fetchNews();
        }
      );
    }
  };

  render() {
    const { articles, loading } = this.state;

    return (
      <>
        <div className="container">
          <h1 className="container my-3 text-dark">Top Headlines</h1>
          {loading && <h2>Loading...</h2>} {/* Display a loading message while fetching news */}
          <div className="row my-3">
            {articles.length > 0 ? (
              articles.map((element) => {
                return (
                  <div className="col md-4 my-1" key={element.id}>
                    <Newsitem
                      newsUrl={element.url}
                      imageUrl={element.image || "No image available"}
                      title={element.title ? element.title.slice(0, 20) : "No title available"}
                      description={element.description ? element.description.slice(0, 50) : "No description available"}
                    />
                  </div>
                );
              })
            ) : (
              !loading && <h2>No articles available.</h2> // Show message if no articles and not loading
            )}
          </div>
        </div>
        <div className="d-flex justify-content-around">
          <button
            onClick={this.handlePrev}
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-primary"
          >
            &laquo; Previous
          </button>
          <button
            type="button"
            onClick={this.handleNext}
            className="btn btn-primary"
            disabled={articles.length === 0}
          >
            Next &raquo;
          </button>
        </div>
      </>
    );
  }
}

export default News;
