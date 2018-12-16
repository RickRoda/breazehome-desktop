FROM node:latest

MAINTAINER David Rodriguez <davrodri@cs.fiu.edu>

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH /root/.yarn/bin:$PATH
RUN yarn global add bower gulp grunt
RUN apt-get update -y && apt-get install -y ruby-full

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY bower.json .

RUN yarn install
# RUN npm install
RUN bower install --allow-root --force
RUN gem update --system
RUN gem install sass
RUN gem install compass

COPY . /usr/src/app
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["grunt", "serve", "--force", "0.0.0.0"]
