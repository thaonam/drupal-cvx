<?php
$rnode = node_load($row->uc_order_products_uc_orders__node_nid);
$rnode_view = node_view($rnode, 'teaser');
echo render($rnode_view);

?>
