# Tentatives d'attaque de l'app

possibilité de se connecter aux différents compte sans passer par la page de connexion (ajout de ?userId= id de n'importe quel compte)
section admin non protégé sur l'url "/admin"
supression des comptes ne fonctionne pas
On peut récupérer les noms des utilisateurs dans le menu admin
si on essaye de se connecter avec le nom d'un utilisateur, on peut voir toutes ses informations dans les logs de l'application(mail et mot de passe)
script et iframes ne fonctionne pas sur l'ajout de tasks
le sql des ajouts de tasks est écrit dans le log, faire attention
creation de sql : ', (SELECt email from users where id=1), 0, 5 ); insert into tasks (title, description, comleted, user_id) values ('. Cela te donne le mail de n'importe quel compte (en remplaçant le 1 par id de n'importe quel compte et le 5 par ton compte à toi). Possibilité de changer email par password ou username pour récupérer les informations de connexion