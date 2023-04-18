import os, os.path
import numpy as np
import datetime as dt

import sqlalchemy
import psycopg2
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, Numeric, String

from flask import Flask, render_template, jsonify, Response

from keys import db_username, db_password

seasons = ['Winter', 'Spring', 'Summer', 'Fall']

#################################################
# Database Setup
#################################################

# reflect an existing database into a new model
Base = automap_base()
class SeasonalPrecip(Base):
    __tablename__ = 'seasonal_precip'
    year = Column('yr', Integer, primary_key=True)
    season = Column('season', String, primary_key=True)
    precipitation = Column('total_precip', Numeric)

# create engine to PostgresDB
engine = create_engine(f"postgresql+psycopg2://{db_username}:{db_password}@localhost:5432/project_3_group_9")
# reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
DailyObs = Base.classes.dnr_daily_weather

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

@app.route("/api/v1.0/precipitation/seasonal/<season>")
def precipitation(season: str):
    if season not in seasons:
        return f"Unknown requested season '{season}'", 400
    print(season)
    # Create our session (link) from Python to the DB
    session = Session(engine)

    ap = session.query(SeasonalPrecip.year, SeasonalPrecip.precipitation).\
        filter(SeasonalPrecip.season==season).\
        order_by(SeasonalPrecip.year).all()
    session.close()

    """Return a list of all precipitation"""
    rs = []
    for p in ap:
        rs.append(dict({'year': p.year, 'precip': p.precipitation}))

    return jsonify(rs)

if __name__ == '__main__':
    app.run(debug=True)
