import json
import random
from kivy.app import App
from kivy.uix.widget import Widget



class FlashLayout(Widget):
    pass

class FlashApp(App):
    def build(self):
        return FlashLayout()

    

    def append_json(self):
        
        with open("./coding-games/src/questions.json", "r") as question_list:
            questions=json.load(question_list)
        
        prevNum = questions[-1]["id"]
        num = prevNum + 1
        question = self.root.ids.questText.text
        answer = self.root.ids.ansText.text
        options = [self.root.ids.ansText.text, self.root.ids.incTextA.text, self.root.ids.incTextB.text, self.root.ids.incTextC.text]
        optionList = random.sample(options, len(options))
        questions.append({
            "id": num,
            "question": question,
            "answer": answer,
            "options": optionList
            })

        with open("./coding-games/src/questions.json", "w") as question_out:
            json.dump(questions, question_out)

        self.root.ids.display.text=f'New Question Added. New Question ID: {num}'

    def clear_json(self):

        question = [{
            "id": 1,
            "question": "Are you ready to study?",
            "answer": "READY!",
            "options": ["Do I gotta?", "Nah, video game time!", "READY!", "Pfftt... Netflix isn't gonna watch itself!"]
            }]

        with open("./coding-games/src/questions.json", "w") as question_list:
            json.dump(question, question_list)

        self.root.ids.display.text=f'Questions removed. Are you ready to make some more?'
if __name__ == '__main__':
    FlashApp().run()
