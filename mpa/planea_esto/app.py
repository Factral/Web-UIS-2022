from flask import Flask, render_template, redirect, request
import sqlite3

app = Flask(__name__)

# def connect():
#  connection = sqlite3.connect('database.db')
#   connection.row_factory = sqlite3.Row
#    return connection


@app.route("/")
def index():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    elements = connection.execute("SELECT * FROM elements").fetchall()
    connection.close()

    return render_template("index.html", list=elements)


@app.route("/<int:element_id>/delete", methods=("POST",))
def delete(element_id):
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    connection.execute("DELETE FROM elements WHERE id=?", (element_id,))
    connection.commit()
    connection.close()
    return redirect("/")


@app.route("/create", methods=("GET", "POST"))
def create():
    if request.method == "POST":
        title = request.form["title"]
        info = request.form["info"]
        connection = sqlite3.connect("database.db")
        connection.row_factory = sqlite3.Row
        connection.execute(
            "INSERT INTO elements (title, body) VALUES (?, ?)", (title, info)
        )
        connection.commit()
        connection.close()
        return redirect("/")
    return render_template("create.html")


@app.route("/<int:element_id>", methods=("GET",))
def show(element_id):
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    element = connection.execute(
        "SELECT * FROM elements WHERE id=?", (element_id,)
    ).fetchone()
    connection.close()
    print(element)
    return render_template("show.html", element=element)
