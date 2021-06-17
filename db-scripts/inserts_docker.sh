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

cat "$not_dependent"

for f in "${not_dependent[@]}";
do
	cat "data/$f" | docker exec -i REDDIT-DB psql -U postgres -d reddit-db
done

read -p "Press enter to continue"
