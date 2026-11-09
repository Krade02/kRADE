-- KRADE café survey: five practice queries.
-- Table: survey(id, week, visit, daypart, rating, recommend_0_10, main_theme)
-- Data: data/survey.csv (360 made-up responses, 12 weeks). Not real client data.
-- Written with AI help; each result is checked against the numbers on the page.

-- 1. Overall satisfaction: share of answers rated 4 or 5.
--    Expect 264 of 360 = 73.3%.
SELECT COUNT(*) AS answers,
       SUM(rating >= 4) AS satisfied,
       ROUND(100.0 * SUM(rating >= 4) / COUNT(*), 1) AS pct_satisfied
FROM survey;

-- 2. Net Promoter Score: (promoters 9-10 minus detractors 0-6) divided by answers.
--    Expect 86 promoters, 126 detractors, NPS -11.
SELECT SUM(recommend_0_10 >= 9) AS promoters,
       SUM(recommend_0_10 <= 6) AS detractors,
       ROUND(100.0 * (SUM(recommend_0_10 >= 9) - SUM(recommend_0_10 <= 6)) / COUNT(*)) AS nps
FROM survey;

-- 3. Which themes were mentioned most?
SELECT main_theme, COUNT(*) AS mentions
FROM survey
GROUP BY main_theme
ORDER BY mentions DESC;

-- 4. Satisfaction by time of day, before and after the new queue system (week 8).
SELECT daypart,
       CASE WHEN week < 8 THEN 'before wk 8' ELSE 'from wk 8' END AS period,
       COUNT(*) AS answers,
       ROUND(100.0 * SUM(rating >= 4) / COUNT(*), 1) AS pct_satisfied
FROM survey
GROUP BY daypart, period
ORDER BY daypart, period;

-- 5. Satisfaction by week (the line on the chart).
SELECT week,
       COUNT(*) AS answers,
       ROUND(100.0 * SUM(rating >= 4) / COUNT(*), 1) AS pct_satisfied
FROM survey
GROUP BY week
ORDER BY week;
