import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import { RestaurantPage } from "./components/Restaurant-page/Restaurant-page.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Basket } from "./components/Basket/Basket";
import Login from "./components/LoginPage/login";
import Dashboard from "./dashBoard";
import RestaurantDashboard from "./components/RestaurantDashboard/RestaurantDashboard";
import UserSignUp from "./components/SignUp/UserSignUp";
import RestaurantLogin from "./components/LoginPage/restaurantLogin";
import RestaurantSignUp from "./components/SignUp/RestaurantSignUp";
import UserProfile from "./components/Profile/UserProfile";
import RestaurantDishDisplay from "./components/RestaurantDashboard/RestaurantDishDisplay";
import AddDish from "./components/AddDish/AddDish";
import PaginationTable from "./components/Orders/restaurantOrders";
import UserOrders from "./components/Orders/UserOrders";
import UserFavorites from "./components/Favorites/UserFavorites";
import CheckOut from "./components/CheckOut/CheckOut";
import NoPermissionPage from "./components/NoPermissionPage";
import { setUser } from "./redux/user";
import { setRestaurant } from "./redux/restaurant";
import { setIsUserLoggedIn } from "./redux/userLogin";
import { setIsRestaurantLoggedIn } from "./redux/restaurantLogin";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basketOrders:
        JSON.parse(window.localStorage.getItem("basketOrders")) || [],
      isBasketOpen: false
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const restaurant = JSON.parse(localStorage.getItem("restaurant"));
    const isUserLoggedIn = JSON.parse(localStorage.getItem("isUserLoggedIn"));
    const isRestaurantLoggedIn = JSON.parse(
      localStorage.getItem("isRestaurantLoggedIn")
    );
    if (restaurant) {
      this.props.setRestaurant(restaurant);
    }
    if (user) {
      this.props.setUser(user);
    }
    if (isUserLoggedIn) {
      this.props.setIsUserLoggedIn();
    }
    if (isRestaurantLoggedIn) {
      this.props.setIsRestaurantLoggedIn();
    }
    if (!this.props.user) {
      //this.props.history.push('/')
      // return <Redirect to={"/"} />
    }
  }

  setOpenBasket = () => {
    this.setState({ isBasketOpen: !this.state.isBasketOpen });
  };

  addToBasket = newOrderArray => {
    this.setState({ basketOrders: [...newOrderArray] });
    window.localStorage.setItem(
      "basketOrders",
      JSON.stringify([...newOrderArray])
    );
  };

  setIsLoggedIn = () => {
    this.setState({ isLoggedIn: true });
  };

  removeFromBasket = dish => {
    let newArray = this.state.basketOrders.filter(basketOrder => {
      return basketOrder !== dish;
    });
    this.setState({
      basketOrders: [...newArray]
    });
    window.localStorage.setItem("basketOrders", JSON.stringify([...newArray]));
  };

  clearBasket = () => {
    this.setState({
      basketOrders: []
    });
    window.localStorage.removeItem("basketOrders");
  };

  renderRestaurantPage = props => {
    return (
      <RestaurantPage
        match={props.match}
        basketOrders={this.state.basketOrders}
        addToBasket={this.addToBasket}
      />
    );
  };
  renderLoginPage = () => {
    return <Login setIsLoggedIn={this.setIsLoggedIn} />;
  };

  render() {
    //if(!this.state.isLoggedIn){
    return (
      <Router>
        {/*<Routing user ={this.props.user} />*/}
        <ScrollToTop>
          {this.state.isBasketOpen && (
            <Basket
              basketOrders={this.state.basketOrders}
              setOpenBasket={this.setOpenBasket}
              removeFromBasket={this.removeFromBasket}
              addToBasket={this.addToBasket}
            />
          )}
          <Header
            open={this.setOpenBasket}
            login={this.props.user || this.props.restaurant}
          />
          <Route
            path="/"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isUserLoggedIn"))) {
                return <Main />;
              } else if (
                JSON.parse(localStorage.getItem("isRestaurantLoggedIn"))
              ) {
                return <RestaurantDashboard />;
              } else {
                return <Login setIsLoggedIn={this.setIsLoggedIn} />;
              }
            }}
          />
          <Route path="/userSignUp" exact component={UserSignUp} />
          <Route path="/restaurantSignup" exact component={RestaurantSignUp} />
          <Route path="/restaurantLogin" exact component={RestaurantLogin} />
          <Route
            path="/dashBoard"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isRestaurantLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <Main />;
              }
            }}
          />
          <Route
            path="/restaurantDashBoard"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isUserLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <RestaurantDashboard />;
              }
            }}
          />
          <Route
            path="/restaurant-page/:id"
            component={this.renderRestaurantPage}
          />
          <Route
            path="/userProfile"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isRestaurantLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <UserProfile />;
              }
            }}
          />
          <Route
            path="/userFavorites"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isRestaurantLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <UserFavorites />;
              }
            }}
          />
          <Route
            path="/userOrders"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isRestaurantLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <UserOrders />;
              }
            }}
          />
          <Route
            path="/checkOut"
            exact
            render={() => {
              if (this.props.isUserLoggedIn) {
                return <CheckOut clearBasket={this.clearBasket} />;
              } else {
                return <NoPermissionPage />;
              }
            }}
          />
          <Route
            path="/dishes"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isUserLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <RestaurantDishDisplay />;
              }
            }}
          />
          <Route
            path="/addDish"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isUserLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <AddDish />;
              }
            }}
          />
          <Route
            path="/restaurantOrders"
            exact
            render={() => {
              if (JSON.parse(localStorage.getItem("isUserLoggedIn"))) {
                return <NoPermissionPage />;
              } else {
                return <PaginationTable />;
              }
            }}
          />
        </ScrollToTop>
        <Footer />
      </Router>
    );
  }
}

function mapStateToProps(globalState) {
  return {
    user: globalState.user,
    restaurant: globalState.restaurant,
    isUserLoggedIn: globalState.isUserLoggedIn,
    isRestaurantLoggedIn: globalState.isRestaurantLoggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: userData => dispatch(setUser(userData)),
    setRestaurant: restaurantData => dispatch(setRestaurant(restaurantData)),
    setIsUserLoggedIn: () => dispatch(setIsUserLoggedIn()),
    setIsRestaurantLoggedIn: () => dispatch(setIsRestaurantLoggedIn())
  };
}

const WithRouterApp = withRouter(App);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithRouterApp);
