# docker
docker stop REDDIT-DB
docker rm REDDIT-DB
docker run --rm --name REDDIT-DB -p 5432:5432 -e POSTGRES_PASSWORD=tajne -e POSTGRES_DB=reddit-db -d postgres

# docker needs a nap to initialize, otherwhise there are errors
sleep 2

# schema
cat ./schema.sql | docker exec -i REDDIT-DB psql -U postgres -d reddit-db

# initial data
not_dependent=(
	subreddit.sql
	reddit_user.sql
	role.sql
)

dependent=(
	subreddit_user.sql
	subreddit_moderator.sql
	user_role.sql
	post.sql
	post_vote.sql
	comment.sql
	survey.sql
	survey_answer.sql
	survey_user_answer.sql
)

not_dependent+=( "${dependent[@]}" )

for f in "${not_dependent[@]}";
do
	cat "data/$f" | docker exec -i REDDIT-DB psql -U postgres -d reddit-db
done

read -p "Press enter to continue"
