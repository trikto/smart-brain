import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";

const particlesOptions = {
	particles: {
		number: {
			value: 30,
			density: {
				enable: true,
				value_area: 400,
			},
		},
	},
	interactivity: {
		detect_on: "window",
		events: {
			onhover: {
				enable: true,
				mode: "repulse",
			},
			resize: true,
		},
		modes: {
			repulse: {
				distance: 100,
				duration: 0.4,
			},
		},
	},
};

const initialState = {
	input: "",
	imageUrl: "",
	box: {},
	route: "signin",
	user: {
		id: "",
		name: "",
		email: "",
		entries: 0,
		joined: "",
	},
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	calculateFaceLocation = (data) => {
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputImage");
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			rightCol: width - clarifaiFace.right_col * width,
			topRow: clarifaiFace.top_row * height,
			bottomRow: height - clarifaiFace.bottom_row * height,
		};
	};

	displayFaceBox = (box) => {
		this.setState({ box: box });
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		fetch("https://intense-reef-80451.herokuapp.com/imageurl", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				input: this.state.input,
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				if (response) {
					fetch("https://intense-reef-80451.herokuapp.com/image", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) =>
							this.setState(
								Object.assign(this.state.user, {
									entries: count,
								})
							)
						)
						.catch(console.log);
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch((err) => console.log(err));
	};

	onRouteChange = (route) => {
		if (route === "signin") {
			this.setState(initialState);
		}
		this.setState({ route: route });
	};

	render() {
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				{this.state.route === "home" ? (
					<div>
						<Navigation onRouteChange={this.onRouteChange} />
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition
							box={this.state.box}
							imageUrl={this.state.imageUrl}
						/>
					</div>
				) : this.state.route === "signin" ? (
					<SignIn
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				) : (
					<div>
						<Navigation onRouteChange={this.onRouteChange} />
						<Register
							onRouteChange={this.onRouteChange}
							loadUser={this.loadUser}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default App;
