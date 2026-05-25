#!/bin/bash
project_name="sei-spa"

function recreate_env() {
    x=$(date)
    echo "Construindo containers"
    docker compose -f docker-compose.yml up -d --force-recreate --no-deps --build $1
    y=$(date)
}

function get_filename() {
    IN=$1
    parse=$(echo $IN | tr "-" "\n")
    suffix=$(echo $parse | awk '{print $2}')
    prefix=".env."
    envname=$(echo $prefix$suffix)
    filename=$MY_ENV_PATH/$envname
    echo $filename
}

function get_aws_env() {
    IN=$1
    parse=$(echo $IN | tr "-" "\n")
    prefix="sei-"
    suffix=$(echo $parse | awk '{print $2}')
    envname=$(echo $suffix)
    echo $prefix$envname
}

function install_by_container() {
  x=$(date)
  echo "Fazendo instalação..."
  apk add $1
  y=$(date)
}

function get_env() {
    filename=$(get_filename $1)
    cp $filename .env
}

function exec_yarn() {
    x=$(date)
    docker exec -it $project_name yarn $1
    y=$(date)
}

function exec_yarn_test() {
    clear
    x=$(date)
    docker exec -it $project_name yarn $1 __tests__/$2
    y=$(date)
}

function set_env_date() {
    filename=$(get_filename $1)
    $(sed -i "s/REACT_APP_DATE_VERSION=.*/REACT_APP_DATE_VERSION=\"$(date '+%d\/%m\/%Y\ %H:%M'\")/g" $filename)
}

function set_env(){
    case $1 in
    "qa")
        filename=$(get_filename deploy-dev)
        $(sed -i "s/REACT_APP_ENV=.*/REACT_APP_ENV=$1/g" $filename)         
    ;;
    *) 
        filename=$(get_filename deploy-$1)
        $(sed -i "s/REACT_APP_ENV=.*/REACT_APP_ENV=$1/g" $filename)         
    ;;
    esac
}

function deploy() {
    case $1 in
    "qa")
        set_env qa 
        set_env_date create-dev 
        dispatch_deploy deploy-dev
    ;;

    "hml")
        set_env hml
        set_env_date create-hml 
        dispatch_deploy deploy-hml
    ;;

    "prod")
        set_env prod 
        set_env_date create-prod 
        dispatch_deploy deploy-prod
    ;;


    "dev")
        set_env dev 
        set_env_date create-dev 
        get_env create-dev  
        recreate_env $project_name 
    ;;

        *) echo "Opção Inválida!" ;;
    esac
}


function git_tag() {
    VERSION=v$(cat package.json | grep version | head -1 | sed 's/[",]//g' | sed 's/[version: ,]//g')
    git checkout $1
    git pull origin $1
    git tag $VERSION  
    git push origin $VERSION
    clear
    echo $VERSION gerada com sucesso!
}

function dispatch_deploy() {
    get_env $1 && export AWS_PROFILE=$(get_aws_env $1) && recreate_env $project_name 

    while [ ! -f ./yarn.lock ] ;
    do
        echo 'Aguarde, estamos preparando tudo para você.'
        sleep 1
        clear
        echo 'Aguarde, estamos preparando tudo para você..'
        sleep 1
        clear
        echo 'Aguarde, estamos preparando tudo para você...'
        sleep 1
        clear
    done

     exec_yarn $1 
}

function auto_enter() {
  for i in 1 2 3 4; do
    echo -ne '\n'
    sleep 1
  done
}


case $1 in
"--create") deploy dev;;
"--test") exec_yarn_test test ;;
"--aws-configure-container") install_by_container 'python3 py-pip' && apk add --no-cache aws-cli && auto_enter | aws configure ;;
"--deploy-dev") deploy qa;;
"--deploy-hml") deploy hml;;
"--deploy-prod") deploy prod;;
"--git-tag") git_tag ;;
"--migrate") exec_yarn migrate ;;
*) echo "Opção Inválida!" ;;
esac
