import { useState, useEffect, React } from "react";
import Card from "./Card";
import axios from "axios";

const QuoteCards = () => {
	const [quotes, setQuotes] = useState([]);
	// USING FETCH API
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await fetch("http://localhost:3300/quotes/");
				const data = await res.json();
				setQuotes(data.quotes); //data from the structure of the api
			} catch (error) {
				console.log("Error fetching data", error);
			}
		};
		fetchCourses();
	}, []);

	return (
		<>
			<div className="grid-cols-1 sm:grid md:grid-cols-2 ">
				{quotes.map((quote) => (
					<Card
						key={quotes.id}
						quote={quote.text}
					/>
				))}
			</div>
		</>
	);
};

export default QuoteCards;
