import os, os.path
import numpy as np
import datetime as dt

import sqlalchemy
import psycopg2
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, Numeric, String, func

from flask import Flask, render_template, jsonify

from keys import db_username, db_password

seasons = ['Winter', 'Spring', 'Summer', 'Fall']

#################################################
# Database Setup
#################################################

# reflect an existing database into a new model
Base = automap_base()
# Views are not automapped; custom class must be declared by hand
class SeasonalPrecip(Base):
    __tablename__ = 'seasons_data'
    year = Column('yr', Integer, primary_key=True)
    season = Column('season', String, primary_key=True)
    precipitation = Column('total_precip', Numeric)

# create engine to PostgresDB
engine = create_engine(f"postgresql+psycopg2://{db_username}:{db_password}@localhost:5432/project_3_group_9")
# reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
DailyObs = Base.classes.dnr_daily_weather
SnowfallByYear = Base.classes.snowfall_by_year

def root_dir():
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):
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

# Endpoint for seasons
@app.route("/api/v1.0/precipitation/seasonal/<season>")
def precipitation(season: str):
    if season not in seasons:
        return f"Unknown requested season '{season}'", 400
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # SQLAlchemy query for seasons (from a view)
    ap = session.query(SeasonalPrecip.year, SeasonalPrecip.precipitation).\
        filter(SeasonalPrecip.season==season).\
        order_by(SeasonalPrecip.year).all()
    session.close()

    """Return a list of all precipitation"""
    rs = []
    for p in ap:
        rs.append(dict({'year': p.year, 'precip': p.precipitation}))

    return jsonify(rs)

# Endpoint for max temps
@app.route("/api/v1.0/maxtemp")
def maxtemp():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # SQLalchemy query aggregating from daily data
    yt = session.query(DailyObs.yr, func.max(DailyObs.max_temp)).\
        group_by(DailyObs.yr).\
        order_by(DailyObs.yr).all()
    session.close()

    """Return a list of all yearly maximum temperatures"""
    rs = []
    for t in yt:
        rs.append(dict({'year': t.yr, 'maxTemp': t[1]}))

    return jsonify(rs)

# Endpoint for snowfall
@app.route("/api/v1.0/snowfall")
def snowfall():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # SQLalchemy query for snowfall (from a table)
    ys = session.query(SnowfallByYear.yr, SnowfallByYear.total_snowfall).\
        order_by(SnowfallByYear.yr).all()
    session.close()

    """Return a list of all yearly snowfalls"""
    rs = []
    for s in ys:
        rs.append(dict({'year': s.yr, 'snowfall': s.total_snowfall}))

    return jsonify(rs)

if __name__ == '__main__':
    app.run(debug=True)
