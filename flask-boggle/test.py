from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage(self):

        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'<p> High Score:', response.data)
            self.assertIn(b'Score', response.data)
            self.assertIn(b'Seconds left', response.data)
    
    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
        response = self.client.get ('/check-word?word=cat')
        self.assertEqual(response.json['result'], 'ok')
    
    def test_invalid_word(self):
        """Word in dictionary"""
        self.client.get('/')
        response = self.client.get('/check-word?word=impossible')
        self.assertEqual(response.json['result'], 'not-on-board')

    def non_english_word(self):
        """Word on the board"""

        self.client.get('/')
        response = self.client.get(
            '/check-word?word=flkfjdlksf')
        self.assertEqual(response.json['result'], 'not-word')


    # TODO -- write tests for every view function / feature!



