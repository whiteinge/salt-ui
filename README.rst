=======
salt-ui
=======

A single-page web application to provide a real-time graphical interface into a
running Salt infrastructure.

NOTE: this software is still pre-alpha.

http://salt-ui.readthedocs.org/

Requirements
============

Support for ES5 is required. This means any modern browser or > IE9.

Development
===========

.. note::

    These steps are only necessary if you wish to set up a development
    environment to make changes to the build process or to pull down new
    versions of any third-party libs.

    If you only wish to hack on salt-ui these deps have been pre-built and are
    available in the sdist tarball on PyPI.

1.  Install Node.js
2.  Install grunt-cli and Bower::

        npm install -g grunt-cli bower

3.  Go to the ``salt-ui`` directory and make a local install of build deps
    listed in ``package.json``::

        cd /path/to/salt-ui
        npm install

4.  Download all the client-side deps using Bower::

        bower install

5.  Collect all the client-side deps into a single directory::

        grunt bower

    .. note::

        At this point you can develop locally using the full (non-production)
        versions of all third-party library files.

6.  Build production versions of all third-party libs and salt-ui itself by
    invoking the r.js optimizer::

        grunt requirejs
