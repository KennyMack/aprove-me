FROM rabbitmq:3.13.0-management-alpine

RUN apk add curl

RUN rabbitmq-plugins enable --offline \
    rabbitmq_shovel rabbitmq_shovel_management

ADD ./rabbitmq.conf /etc/rabbitmq/conf.d/11-custom.conf
