from fabric.api import *
import os
import fabric.contrib.project as project

PROD = 'blsmth.github.com'
DEST_PATH = '/'
ROOT_PATH = os.path.abspath(os.path.dirname(__file__))
DEPLOY_PATH = os.path.join(ROOT_PATH, 'deploy')

def clean():
    local('rm -rf ./deploy')

def regen():
    clean()
    local('hyde gen')

def serve():
    local('hyde serve -a 0 -p 8000')

def reserve():
    regen()
    serve()

def smush():
    local('smusher ./media/images')

@hosts(PROD)
def publish():
    regen()
    project.rsync_project(
        remote_dir=DEST_PATH,
        local_dir=DEPLOY_PATH.rstrip('/') + '/',
        delete=True
    )