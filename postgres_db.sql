CREATE TABLE weather_data (
  "Date" date,
  "Maximum Temperature degrees (F)" integer,
  "Minimum Temperature degrees (F)" integer,
  "Precipitation (inches)" decimal,
  "Snow (inches)" decimal
);


CREATE VIEW seasons_data AS
SELECT 
  EXTRACT(YEAR FROM weather_data."Date") AS Year,
  CASE
    WHEN EXTRACT(MONTH FROM weather_data."Date") BETWEEN 3 AND 5 THEN 'Spring'
    WHEN EXTRACT(MONTH FROM weather_data."Date") BETWEEN 6 AND 8 THEN 'Summer'
    WHEN EXTRACT(MONTH FROM weather_data."Date") BETWEEN 9 AND 11 THEN 'Fall'
    ELSE 'Winter'
  END AS Season,
  AVG(weather_data."Maximum Temperature degrees (F)") AS MaxTemp,
  AVG(weather_data."Minimum Temperature degrees (F)") AS MinTemp,
  AVG(weather_data."Precipitation (inches)") AS Precipitation,
  AVG(weather_data."Snow (inches)") AS Snow
FROM weather_data
GROUP BY Year, Season;

SELECT * FROM seasons_data

