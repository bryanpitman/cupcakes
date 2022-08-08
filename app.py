"""Flask app for Cupcakes"""


from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)


@app.get("/api/cupcakes")
def list_all_cupcakes():
    """Return JSON {cupcakes: {id, flavor, size, rating, image}}"""

    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)

@app.get("/api/cupcakes/<cupcake_id>")
def list_single_cupcake(cupcake_id):
    """Return JSON {cupcake: {id, flavor, size, rating, image}}"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)

@app.post("/api/cupcakes")
def create_cupcake():
    """Create cupcake from form data & return it.

    Returns JSON {cupcake: {id, flavor, size, rating, image}}}
    """

    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json.get("image", None) #do this so that "" appears as None
    # NOW you can skip the image in request without getting key error

    new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

    db.session.add(new_cupcake)
    db.session.commit()

    serialized = new_cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)

@app.patch('/api/cupcakes/<int:cupcake_id>')
def update_cupcake(cupcake_id):
    """ Update cupcake with id cupcake_id and return it.
    
    Returns JSON {cupcake: {id, flavor, size, rating, image}}
    """

    cupcake = Cupcake.query.get_or_404(cupcake_id)

    # if 'flavor' in request.json:
    #     flavor = request.json['flavor']
    #     cupcake.flavor= flavor

    cupcake.flavor = request.json.get('flavor', cupcake.flavor) # this is much simpler!!
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)

    db.session.commit()

    # cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)

@app.delete('/api/cupcakes/<int:cupcake_id>')
def delete_cupcake(cupcake_id):
    """ Delete cupcake and
    Returns JSON {deleted: [cupcake-id]} """

    Cupcake.query.filter_by(id=cupcake_id).delete()

    db.session.commit()

    return jsonify(deleted=cupcake_id)

@app.get('/')
def show_home_page():
    """ Display home page and new cupcake form """

