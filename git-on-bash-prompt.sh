# Add git branch to bash prompt and color it based
# on git status of current branch
COLOR_RED="\033[0;31m"
COLOR_YELLOW="\033[0;33m"
COLOR_GREEN="\033[0;32m"
COLOR_OCHRE="\033[38;5;95m"
COLOR_LAVENDER="\e[38;5;147m"
COLOR_BLUE="\033[0;34m"
COLOR_WHITE="\033[0;37m"
COLOR_RESET="\033[0m"
COLOR_LIGHT_BLUE="\e[94m"
BOLD="\e[1m"
 
# Chooses a color based off the result of git status
function git_color {
  local git_status="$(git status 2> /dev/null)"
 
  if [[ ! $git_status =~ "working tree clean" ]]; then
    echo -e $COLOR_RED
  elif [[ $git_status =~ "Your branch is ahead of" ]]; then
    echo -e $COLOR_YELLOW
  elif [[ $git_status =~ "nothing to commit" ]]; then
    echo -e $COLOR_GREEN
  else
    echo -e $COLOR_OCHRE
  fi
}
 
# Prints your current git branch name or commit if detached
function git_branch {
  local git_status="$(git status 2> /dev/null)"
  local on_branch="On branch ([^${IFS}]*)"
  local on_commit="HEAD detached at ([^${IFS}]*)"
 
  if [[ $git_status =~ $on_branch ]]; then
    local branch=${BASH_REMATCH[1]}
    echo "$branch"
  elif [[ $git_status =~ $on_commit ]]; then
    local commit=${BASH_REMATCH[1]}
    echo "$commit"
  fi
}

PS1="\[$BOLD\]\u@cloudshell\[$BOLD$COLOR_WHITE\]:\[$BOLD$COLOR_LIGHT_BLUE\]\w" # recreates default bash prompt without "$"
PS1+="\[\$(git_color)\]"        # colors git status
PS1+="\[$BOLD\](\$(git_branch))"           # prints current branch
PS1+="\[$COLOR_RESET\]\$ "
