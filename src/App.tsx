import { useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    FloatingLabel,
    Form,
    Row,
} from "react-bootstrap";

function App() {
    const [review, setReview] = useState(
        `Parasite is an exceptional masterpiece that expertly blends dark humor, social commentary, and thrilling suspense into a genre-defying film that keeps you on the edge of your seat from start to finish. The performances are superb, the cinematography is stunning, and the story is a masterclass in storytelling that leaves a lasting impact.`
    );
    const [result, setResult] = useState({
        label: "positive",
        confidence: 0.999,
    });
    const [loading, setLoading] = useState(false);
    const [isShowingForm, setIsShowingForm] = useState(true);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const modelEndpoint = import.meta.env.VITE_MODEL_ENDPOINT;
            const request = await fetch(modelEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: review,
                }),
            });
            const response = await request.json();
            console.log(response);
            setLoading(false);
            setIsShowingForm(false);
        } catch (error) {
            console.log(`Something went wrong: ${error}`);
        }
    };

    return (
        <Container className="py-4">
            <h1 className="text-center mb-4">
                <u>Movie Reviews Classifier</u>
            </h1>
            <p>
                This web-app is developed as a portal to interact with a simple
                implementation of the model proposed by Yoon Kim in his 2014
                paper{" "}
                <a href="https://aclanthology.org/D14-1181/" target="_blank">
                    "Convolutional Neural Networks for Sentence Classification"
                </a>
                . The architecture of the model used in this demo is as follows:
                <ul>
                    <li>
                        The input is a sequence of words, embedded into a
                        continuous vector space using a pre-trained word
                        embedding{" "}
                        <a href="https://code.google.com/archive/p/word2vec/">
                            <code>word2vec</code>
                        </a>
                        .
                    </li>
                    <li>
                        The sequence of word embeddings is passed through a 1D
                        CNN with <code>100</code> filters of size <code>3</code>
                        , <code>4</code> and <code>5</code>.
                    </li>
                    <li>
                        The outputs of the CNN are pooled using max-pooling and
                        concatenated.
                    </li>
                    <li>
                        The concatenated vector is passed through a fully
                        connected layer with <code>100</code> units and a
                        dropout layer with a dropout rate of <code>0.5</code>.
                    </li>
                    <li>
                        The output of the dropout layer is passed through a
                        fully connected layer with a single unit and a sigmoid
                        activation function.
                    </li>
                </ul>
            </p>
            <p className="text-secondary">
                <small>
                    The model is implemented in Python using the Keras library,
                    and trained on the IMDB movie review dataset. The app is
                    developed using Vite + React + Bootstrap.
                </small>
            </p>
            <div className="btn-group d-md-none" role="group">
                <Button
                    variant={isShowingForm ? "dark" : "outline-dark"}
                    onClick={() => setIsShowingForm(true)}
                    className="rounded-0 border-bottom-0">
                    Form
                </Button>
                <Button
                    variant={isShowingForm ? "outline-dark" : "dark"}
                    onClick={() => setIsShowingForm(false)}
                    className="rounded-0 border-bottom-0">
                    Result
                </Button>
            </div>
            <Row>
                <Col
                    className={isShowingForm ? "d-block" : "d-none d-md-block"}>
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel label="Review">
                            <Form.Control
                                as="textarea"
                                placeholder="Write (or paste) your review here."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                style={{ height: "250px" }}
                                className="rounded-0 border-dark"
                            />
                        </FloatingLabel>
                        <Button
                            type="submit"
                            variant="dark"
                            disabled={loading}
                            className="rounded-0 border-top-0">
                            Predict
                        </Button>
                    </Form>
                </Col>
                <Col
                    className={isShowingForm ? "d-none d-md-block" : "d-block"}>
                    <Card
                        bg={
                            loading
                                ? "white"
                                : result.label === "positive"
                                ? "success"
                                : "danger"
                        }
                        text={loading ? "dark" : "white"}
                        className="rounded-0 border-dark">
                        <Card.Body>
                            <Card.Text>
                                {loading ? (
                                    "Loading..."
                                ) : (
                                    <span>
                                        The model predicts that the review is{" "}
                                        <strong>{result.label}</strong> with a
                                        confidence of{" "}
                                        <strong>{result.confidence}</strong>
                                    </span>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
